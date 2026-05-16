import os
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Batch, Item

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXT = {'jpg', 'jpeg', 'png', 'gif', 'webp'}

batches_bp = Blueprint('batches', __name__)

def _item_json(item):
    return {
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'image_url': item.image_url,
        'created_at': item.created_at.isoformat() if item.created_at else None,
    }

def _batch_json(batch):
    return {
        'id': batch.id,
        'qr_token': batch.qr_token,
        'name': batch.name,
        'description': batch.description,
        'status': batch.status,
        'created_at': batch.created_at.isoformat() if batch.created_at else None,
        'items': [_item_json(i) for i in batch.items],
    }

@batches_bp.route('', methods=['GET'])
@jwt_required()
def list_batches():
    user_id = int(get_jwt_identity())
    bs = Batch.query.filter_by(user_id=user_id).order_by(Batch.created_at.desc()).all()
    return jsonify([_batch_json(b) for b in bs])

@batches_bp.route('', methods=['POST'])
@jwt_required()
def create_batch():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'name is required'}), 400
    batch = Batch(user_id=user_id, name=data['name'], description=data.get('description'))
    db.session.add(batch)
    db.session.commit()
    return jsonify(_batch_json(batch)), 201

@batches_bp.route('/<int:batch_id>', methods=['GET'])
@jwt_required()
def get_batch(batch_id):
    user_id = int(get_jwt_identity())
    batch = Batch.query.filter_by(id=batch_id, user_id=user_id).first_or_404()
    return jsonify(_batch_json(batch))

@batches_bp.route('/<int:batch_id>/items', methods=['POST'])
@jwt_required()
def add_item(batch_id):
    user_id = int(get_jwt_identity())
    batch = Batch.query.filter_by(id=batch_id, user_id=user_id).first_or_404()

    image_url = None
    if request.content_type and 'multipart' in request.content_type:
        name = request.form.get('name')
        description = request.form.get('description') or None
        file = request.files.get('image')
        if file and file.filename:
            ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
            if ext in ALLOWED_EXT:
                filename = f"{uuid.uuid4().hex}.{ext}"
                os.makedirs(UPLOAD_DIR, exist_ok=True)
                file.save(os.path.join(UPLOAD_DIR, filename))
                image_url = f"/uploads/{filename}"
    else:
        data = request.get_json() or {}
        name = data.get('name')
        description = data.get('description') or None

    if not name:
        return jsonify({'error': 'name is required'}), 400

    item = Item(batch_id=batch.id, name=name, description=description, image_url=image_url)
    db.session.add(item)
    db.session.commit()
    return jsonify(_item_json(item)), 201

@batches_bp.route('/<int:batch_id>/items/<int:item_id>', methods=['PATCH'])
@jwt_required()
def edit_item(batch_id, item_id):
    user_id = int(get_jwt_identity())
    batch = Batch.query.filter_by(id=batch_id, user_id=user_id).first_or_404()
    item = Item.query.filter_by(id=item_id, batch_id=batch.id).first_or_404()
    data = request.get_json() or {}
    if data.get('name'):
        item.name = data['name']
    if 'description' in data:
        item.description = data['description']
    db.session.commit()
    return jsonify(_item_json(item))
