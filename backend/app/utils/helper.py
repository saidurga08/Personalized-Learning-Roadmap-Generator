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

    # Unwrap SQLAlchemy ConnectionFairy wrapper if present
    driver_conn = getattr(conn, 'driver_connection', None) or getattr(conn, 'connection', conn)
    is_sqlite = "sqlite" in type(driver_conn).__module__.lower()

    if is_sqlite:
        import sqlite3
        try:
            driver_conn.row_factory = sqlite3.Row
            cursor = driver_conn.cursor()
        except Exception:
            cursor = conn.cursor()
        # Convert PostgreSQL placeholders %s to SQLite ?
        formatted_query = query.replace("%s", "?")
    else:
        if HAS_PSYCOPG2:
            try:
                cursor = conn.cursor(cursor_factory=RealDictCursor)
            except TypeError:
                cursor = conn.cursor()
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

    try:
        conn.commit()
    except Exception:
        pass

    cursor.close()
    try:
        conn.close()
    except Exception:
        pass

    return result