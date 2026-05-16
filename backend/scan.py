from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, Batch, ScanLog, User
from datetime import datetime, timezone, timedelta

def now_bkk():
    return datetime.now(timezone(timedelta(hours=7))).replace(tzinfo=None)

scan_bp = Blueprint('scan', __name__)

def _staff_required():
    return get_jwt().get('role') == 'staff'

@scan_bp.route('/<qr_token>', methods=['GET'])
@jwt_required()
def resolve_token(qr_token):
    batch = Batch.query.filter_by(qr_token=qr_token).first_or_404()
    owner = User.query.get(batch.user_id)
    return jsonify({
        'batch_id': batch.id,
        'batch_name': batch.name,
        'status': batch.status,
        'owner': {
            'id': owner.id,
            'full_name': owner.full_name,
            'email': owner.email,
        },
        'items': [
            {'id': i.id, 'name': i.name, 'description': i.description,
             'image_url': i.image_url, 'created_at': i.created_at.isoformat() if i.created_at else None}
            for i in batch.items
        ],
    })

@scan_bp.route('/<qr_token>/deposit', methods=['POST'])
@jwt_required()
def deposit(qr_token):
    if not _staff_required():
        return jsonify({'error': 'Staff only'}), 403

    batch = Batch.query.filter_by(qr_token=qr_token).first_or_404()
    if batch.status != 'pending':
        return jsonify({'error': f'Cannot deposit — batch is already {batch.status}'}), 400

    staff_id = int(get_jwt_identity())
    checkpoint = (request.get_json() or {}).get('checkpoint', '')

    batch.status = 'deposited'
    batch.deposited_at = now_bkk()
    batch.staff_id = staff_id

    log = ScanLog(batch_id=batch.id, staff_id=staff_id, action='deposit', checkpoint=checkpoint)
    db.session.add(log)
    db.session.commit()

    return jsonify({'message': 'Batch deposited successfully', 'batch_id': batch.id, 'status': batch.status})

@scan_bp.route('/<qr_token>/checkout', methods=['POST'])
@jwt_required()
def checkout(qr_token):
    if not _staff_required():
        return jsonify({'error': 'Staff only'}), 403

    batch = Batch.query.filter_by(qr_token=qr_token).first_or_404()
    if batch.status != 'deposited':
        return jsonify({'error': f'Cannot checkout — batch is {batch.status}'}), 400

    staff_id = int(get_jwt_identity())
    checkpoint = (request.get_json() or {}).get('checkpoint', '')

    batch.status = 'claimed'
    batch.claimed_at = now_bkk()

    log = ScanLog(batch_id=batch.id, staff_id=staff_id, action='checkout', checkpoint=checkpoint)
    db.session.add(log)
    db.session.commit()

    return jsonify({'message': 'Batch claimed successfully', 'batch_id': batch.id, 'status': batch.status})
