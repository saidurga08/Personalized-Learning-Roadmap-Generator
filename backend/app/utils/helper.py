from app.database import get_connection

try:
    from psycopg2.extras import RealDictCursor
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False


def execute_query(
    query,
    params=None,
    fetch_one=False,
    fetch_all=False
):
    conn = get_connection()

    # Check if connection is SQLite or PostgreSQL
    is_sqlite = type(conn).__module__.startswith("sqlite")

    if is_sqlite:
        import sqlite3
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        # Convert PostgreSQL placeholders %s to SQLite ?
        formatted_query = query.replace("%s", "?")
    else:
        if HAS_PSYCOPG2:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
        else:
            cursor = conn.cursor()
        formatted_query = query

    cursor.execute(formatted_query, params or ())

    result = None
    if fetch_one:
        row = cursor.fetchone()
        if row:
            result = dict(row) if hasattr(row, 'keys') else row
    elif fetch_all:
        rows = cursor.fetchall()
        if rows:
            result = [dict(r) if hasattr(r, 'keys') else r for r in rows]

    conn.commit()
    cursor.close()
    conn.close()

    return result