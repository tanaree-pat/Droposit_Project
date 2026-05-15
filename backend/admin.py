from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import Batch, User

admin_bp = Blueprint('admin', __name__)

def _staff_required():
    return get_jwt().get('role') == 'staff'

@admin_bp.route('/batches', methods=['GET'])
@jwt_required()
def list_batches():
    if not _staff_required():
        return jsonify({'error': 'Staff only'}), 403

    status = request.args.get('status')
    query = Batch.query
    if status:
        query = query.filter_by(status=status)
    batches = query.order_by(Batch.created_at.desc()).all()

    result = []
    for b in batches:
        owner = User.query.get(b.user_id)
        result.append({
            'id': b.id,
            'name': b.name,
            'status': b.status,
            'owner': owner.full_name if owner else 'Unknown',
            'item_count': len(b.items),
            'created_at': b.created_at.isoformat() if b.created_at else None,
            'deposited_at': b.deposited_at.isoformat() if b.deposited_at else None,
            'claimed_at': b.claimed_at.isoformat() if b.claimed_at else None,
        })
    return jsonify(result)

@admin_bp.route('/batches/<int:batch_id>', methods=['GET'])
@jwt_required()
def get_batch(batch_id):
    if not _staff_required():
        return jsonify({'error': 'Staff only'}), 403

    batch = Batch.query.get_or_404(batch_id)
    owner = User.query.get(batch.user_id)

    return jsonify({
        'id': batch.id,
        'name': batch.name,
        'description': batch.description,
        'status': batch.status,
        'owner': {
            'id': owner.id if owner else None,
            'full_name': owner.full_name if owner else 'Unknown',
            'email': owner.email if owner else '',
        },
        'items': [
            {
                'id': i.id,
                'name': i.name,
                'description': i.description,
                'image_url': i.image_url,
                'created_at': i.created_at.isoformat() if i.created_at else None,
            }
            for i in batch.items
        ],
        'deposited_at': batch.deposited_at.isoformat() if batch.deposited_at else None,
        'claimed_at': batch.claimed_at.isoformat() if batch.claimed_at else None,
    })
