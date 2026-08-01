import json

from app.utils.helper import execute_query


def save_goal(
    user_id,
    roadmap
):

    query = """
    INSERT INTO goals
    (
        user_id,
        title,
        description
    )

    VALUES
    (
        %s,
        %s,
        %s
    )

    RETURNING id;
    """

    result = execute_query(

        query,

        (

            user_id,

            roadmap.title,

            roadmap.goal

        ),

        fetch_one=True

    )

    return result["id"]
    pass


def save_roadmap(
    user_id,
    goal_id,
    roadmap
):

    query = """
    INSERT INTO roadmaps
    (
        user_id,
        goal_id,
        title,
        goal,
        skill_level,
        roadmap_json
    )

    VALUES
    (
        %s,
        %s,
        %s,
        %s,
        %s,
        %s
    )

    RETURNING id;
    """

    result = execute_query(

        query,

        (

            user_id,

            goal_id,

            roadmap.title,

            roadmap.goal,

            roadmap.skill_level,

            json.dumps(
                roadmap.model_dump()
            )

        ),

        fetch_one=True

    )

    return result["id"]
    pass


def save_constraints(
    roadmap_id,
    request
):

    query = """
    INSERT INTO roadmap_constraints
    (
        roadmap_id,
        hours_per_week,
        budget,
        learning_method,
        prior_experience
    )

    VALUES
    (
        %s,
        %s,
        %s,
        %s,
        %s
    );
    """

    execute_query(

        query,

        (

            roadmap_id,

            request.hours_per_week,

            request.budget,

            request.learning_method,

            request.prior_experience

        )

    )
    pass


def save_steps(
    roadmap_id,
    roadmap
):

    order_index = 1

    for week in roadmap.weeks:

        week_query = """
        INSERT INTO roadmap_steps
        (
            roadmap_id,
            week_number,
            title,
            description,
            assignment,
            is_milestone,
            order_index,
            estimated_hours
        )

        VALUES
        (
            %s,%s,%s,%s,%s,%s,%s,%s
        )

        RETURNING id;
        """

        week_result = execute_query(

            week_query,

            (
                roadmap_id,
                week.week_number,
                week.title,
                week.description,
                week.assignment,
                True,
                order_index,
                week.estimated_hours
            ),

            fetch_one=True

        )

        week_step_id = week_result["id"]

        order_index += 1

        for topic in week.topics:

            topic_query = """
            INSERT INTO roadmap_steps
            (
                roadmap_id,
                parent_step_id,
                week_number,
                title,
                description,
                order_index,
                estimated_hours
            )

            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s
            )

            RETURNING id;
            """

            topic_result = execute_query(

                topic_query,

                (
                    roadmap_id,
                    week_step_id,
                    week.week_number,
                    topic.title,
                    topic.description,
                    order_index,
                    topic.estimated_hours
                ),

                fetch_one=True

            )

            topic_step_id = topic_result["id"]

            order_index += 1

            save_resources(
                topic_step_id,
                topic.resources
            )
    pass


def save_resources(step_id, resources):

    query = """
    INSERT INTO resources (
        step_id,
        title,
        url,
        resource_type,
        is_free
    )
    VALUES (%s, %s, %s, %s, %s);
    """

    ALLOWED_RESOURCE_TYPES = {
        "video",
        "article",
        "website",
        "course",
        "book",
        "documentation",
        "other"
    }

    for resource in resources:

        resource_type = resource.type.lower()

        if resource_type not in ALLOWED_RESOURCE_TYPES:
            resource_type = "other"

        execute_query(
            query,
            (
                step_id,
                resource.title,
                resource.url,
                resource_type,
                resource.is_free
            )
        )

def load_roadmap(roadmap_id):

    print("Roadmap ID:", roadmap_id)

    query = """
    SELECT roadmap_json
    FROM roadmaps
    WHERE id = %s;
    """

    result = execute_query(
        query,
        (roadmap_id,),
        fetch_one=True
    )

    print("Raw DB result:", result)
    print("Type of result:", type(result))

    if result is None:
        raise Exception("Roadmap not found!")

    print("Roadmap JSON:", result["roadmap_json"])
    print("Type of roadmap_json:", type(result["roadmap_json"]))

    return result["roadmap_json"]

def update_roadmap_json(
    roadmap_id,
    roadmap
):

    query = """
    UPDATE roadmaps

    SET roadmap_json=%s

    WHERE id=%s;
    """

    execute_query(

        query,

        (
            json.dumps(
                roadmap.model_dump()
            ),
            roadmap_id
        )

    )
    pass