from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta
import uuid

def now_bkk():
    return datetime.now(timezone(timedelta(hours=7))).replace(tzinfo=None)

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(30))
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='depositor')
    created_at = db.Column(db.DateTime, default=now_bkk)
    batches = db.relationship('Batch', foreign_keys='Batch.user_id', backref='owner', lazy=True)

class Batch(db.Model):
    __tablename__ = 'batches'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    qr_token = db.Column(db.String(64), unique=True, nullable=False,
                         default=lambda: f"drp-{uuid.uuid4().hex[:8]}")
    status = db.Column(db.String(20), nullable=False, default='pending')
    deposited_at = db.Column(db.DateTime)
    claimed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=now_bkk)
    items = db.relationship('Item', backref='batch', lazy=True)
    scan_logs = db.relationship('ScanLog', backref='batch', lazy=True)

class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batches.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(512))
    created_at = db.Column(db.DateTime, default=now_bkk)

class ScanLog(db.Model):
    __tablename__ = 'scan_logs'
    id = db.Column(db.Integer, primary_key=True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batches.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(20), nullable=False)
    checkpoint = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=now_bkk)
