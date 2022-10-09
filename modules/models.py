from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects import postgresql
import uuid

engine = create_engine('postgresql+psycopg2://postgres:root@localhost/test_quizzle_2')
engine.connect()

Base = declarative_base()


class Data(Base):
    __tablename__ = 'data'
    id = Column(postgresql.UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    username = Column(Text(), nullable=False)
    quizname = Column(Text(), nullable=False)
    quiz_link = Column(Text(), nullable=False)
    link_to_qr = Column(Text(), nullable=False)
    six_digit_code = Column(Text(), nullable=False)
    twelve_digit_code = Column(Text(), nullable=False)


class MainTable(Base):
    __tablename__ = 'main_table'
    id = Column(postgresql.UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    name = Column(Text(), nullable=False)
    email = Column(Text(), nullable=False)
    password = Column(Text(), nullable=False)
    settings = Column(Text(), nullable=False)
    data = Column(Text(), nullable=False)


class QuizStatistics(Base):
    __tablename__ = 'quiz_statistics'
    id = Column(postgresql.UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    owner_name = Column(Text(), nullable=False)
    quiz_name = Column(Text(), nullable=False)
    student_name = Column(Text(), nullable=False)
    value = Column(Text(), nullable=False)


Base.metadata.create_all(engine)