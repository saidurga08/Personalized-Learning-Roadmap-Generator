def modify_roadmap(request):

    return {
        "status": "success",
        "message": "Roadmap modification service reached",
        "request": request.model_dump()
    }