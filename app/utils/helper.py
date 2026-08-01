from psycopg2.extras import RealDictCursor

from app.database import get_connection


def execute_query(query, params=None, fetch_one=False, fetch_all=False):

    conn = get_connection()

    cursor = conn.cursor(
        cursor_factory=RealDictCursor
    )

    cursor.execute(query, params)

    result = None

    if fetch_one:

        result = cursor.fetchone()

    elif fetch_all:

        result = cursor.fetchall()

    conn.commit()

    cursor.close()

    conn.close()

    return result