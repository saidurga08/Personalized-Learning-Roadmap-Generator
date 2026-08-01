from app.utils.helper import execute_query


def get_roadmap(roadmap_id):

    query = """
    SELECT *
    FROM roadmaps
    WHERE id = %s
    """

    return execute_query(
        query,
        (roadmap_id,),
        fetch_one=True
    )


def get_constraints(roadmap_id):

    query = """
    SELECT *
    FROM roadmap_constraints
    WHERE roadmap_id=%s
    """

    return execute_query(
        query,
        (roadmap_id,),
        fetch_one=True
    )