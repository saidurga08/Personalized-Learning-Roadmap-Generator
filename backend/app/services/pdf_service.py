import io
import urllib.parse
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)


def generate_roadmap_pdf(roadmap_data: dict) -> bytes:
    buffer = io.BytesIO()
    
    # Setup document geometry
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom palette
    PRIMARY = colors.HexColor("#312E81")    # Deep Indigo
    SECONDARY = colors.HexColor("#4F46E5")  # Indigo accent
    ACCENT = colors.HexColor("#9333EA")     # Purple
    TEXT_DARK = colors.HexColor("#0F172A")  # Slate 900
    TEXT_MUTED = colors.HexColor("#475569") # Slate 600
    BG_LIGHT = colors.HexColor("#F8FAFC")   # Slate 50
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=ACCENT,
        textTransform='uppercase',
        spaceAfter=12
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_DARK
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=6
    )

    h3_style = ParagraphStyle(
        'Heading3Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=SECONDARY,
        spaceBefore=6,
        spaceAfter=4
    )

    resource_link_style = ParagraphStyle(
        'ResourceLink',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#2563EB") # Blue link
    )

    story = []

    # Goal and Roadmap Header
    goal_title = roadmap_data.get("goal") or roadmap_data.get("roadmap_json", {}).get("goal") or "Personalized AI Learning Roadmap"
    difficulty = roadmap_data.get("difficulty") or "Intermediate"
    hours_per_wk = roadmap_data.get("hours_per_week") or 10
    budget = roadmap_data.get("budget") or "Free"
    
    roadmap_json = roadmap_data.get("roadmap_json") or {}
    weeks = roadmap_json.get("weeks") or roadmap_json.get("roadmap", {}).get("weeks") or []
    duration = roadmap_json.get("duration") or f"{len(weeks)} Weeks"

    story.append(Paragraph("LEARNPATH AI — PERSONALIZED GUIDEBOOK", subtitle_style))
    story.append(Paragraph(goal_title, title_style))
    story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceBefore=6, spaceAfter=12))

    # Metadata Grid Table
    meta_data = [
        [
            Paragraph(f"<b>Skill Level:</b> {difficulty}", body_style),
            Paragraph(f"<b>Target Duration:</b> {duration}", body_style),
            Paragraph(f"<b>Weekly Commitment:</b> {hours_per_wk} hrs/wk", body_style),
            Paragraph(f"<b>Budget:</b> {budget}", body_style),
        ]
    ]

    meta_table = Table(meta_data, colWidths=[130, 130, 150, 130])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # Overview Section
    overview_text = roadmap_json.get("overview") or f"A structured {duration} comprehensive AI-generated learning pathway tailored to master {goal_title} with practical hands-on exercises and curated resources."
    story.append(Paragraph("Executive Overview", h2_style))
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 14))

    # Weekly Curriculum Section
    story.append(Paragraph("Weekly Curriculum & Actionable Goals", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=4, spaceAfter=10))

    for idx, week in enumerate(weeks):
        week_num = week.get("week") or week.get("week_number") or idx + 1
        week_title = week.get("title") or f"Module {week_num}: {goal_title} Concepts"
        week_desc = week.get("description") or "Applied learning module."

        week_elements = []

        # Week Title Header Banner
        header_p = Paragraph(f"<b>WEEK {week_num}: {week_title.upper()}</b>", ParagraphStyle(
            'WeekHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.white
        ))
        
        header_table = Table([[header_p]], colWidths=[540])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PRIMARY),
            ('PADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        week_elements.append(header_table)
        week_elements.append(Spacer(1, 6))
        week_elements.append(Paragraph(f"<i>{week_desc}</i>", body_style))
        week_elements.append(Spacer(1, 6))

        # Topics List
        topics = week.get("topics") or []
        if topics:
            week_elements.append(Paragraph("Key Topics Covered", h3_style))
            topic_items = []
            for t in topics:
                t_str = t if isinstance(t, str) else t.get("title") or t.get("name") or "Topic"
                topic_items.append(f"• {t_str}")
            topics_text = " &nbsp;&nbsp;&nbsp; ".join(topic_items)
            week_elements.append(Paragraph(topics_text, body_style))
            week_elements.append(Spacer(1, 6))

        # Actionable Tasks
        tasks = week.get("tasks") or []
        if tasks:
            week_elements.append(Paragraph("Actionable Tasks & Checklists", h3_style))
            task_rows = []
            for task in tasks:
                t_title = task.get("title") if isinstance(task, dict) else str(task)
                checkbox = "[X]" if isinstance(task, dict) and task.get("completed") else "[  ]"
                task_rows.append([Paragraph(f"<b>{checkbox}</b>", body_style), Paragraph(t_title, body_style)])

            task_table = Table(task_rows, colWidths=[30, 510])
            task_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('PADDING', (0, 0), (-1, -1), 3),
            ]))
            week_elements.append(task_table)
            week_elements.append(Spacer(1, 6))

        # Curated Resources with explicit link URLs
        resources = week.get("resources") or []
        if not resources and week.get("topics"):
            for top in week.get("topics"):
                if isinstance(top, dict) and top.get("resources"):
                    resources.extend(top.get("resources"))

        if not resources:
            goal_query = urllib.parse.quote(f"{goal_title} week {week_num} tutorial")
            resources = [
                {"title": f"{goal_title} Video Tutorial & Course (Week {week_num})", "url": f"https://www.youtube.com/results?search_query={goal_query}", "type": "Video"},
                {"title": f"{goal_title} Official Documentation Guide", "url": f"https://developer.mozilla.org/en-US/search?q={urllib.parse.quote(goal_title)}", "type": "Documentation"}
            ]

        if resources:
            week_elements.append(Paragraph("Curated Learning Resources & Links", h3_style))
            res_rows = []
            for res in resources:
                r_title = res.get("title") or "Learning Guide"
                r_url = res.get("url") or f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_title + ' tutorial')}"
                r_type = res.get("type") or "Resource"
                res_rows.append([
                    Paragraph(f"<b>[{r_type.upper()}]</b>", ParagraphStyle('TypeLabel', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=ACCENT)),
                    Paragraph(f"<b>{r_title}</b><br/><font color='#2563EB'><u><a href='{r_url}'>{r_url}</a></u></font>", resource_link_style)
                ])
            
            res_table = Table(res_rows, colWidths=[80, 460])
            res_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('PADDING', (0, 0), (-1, -1), 3),
            ]))
            week_elements.append(res_table)
            week_elements.append(Spacer(1, 6))

        # Milestone & Assignment
        assignment = week.get("assignment")
        milestone = week.get("milestone")
        if assignment or milestone:
            info_text = []
            if milestone:
                info_text.append(f"<b>Milestone:</b> {milestone}")
            if assignment:
                info_text.append(f"<b>Assignment:</b> {assignment}")
            
            milestone_p = Paragraph("<br/>".join(info_text), ParagraphStyle(
                'MilestoneP', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=PRIMARY
            ))

            m_table = Table([[milestone_p]], colWidths=[540])
            m_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F3E8FF")), # Soft purple
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#D8B4FE")),
                ('PADDING', (0, 0), (-1, -1), 5),
            ]))
            week_elements.append(m_table)

        week_elements.append(Spacer(1, 12))
        story.append(KeepTogether(week_elements))

    # Footer Notice
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=10, spaceAfter=8))
    footer_text = Paragraph("Generated by LearnPath AI Platform • Interactive Roadmap Guidebook", ParagraphStyle(
        'FooterP', parent=styles['Normal'], fontName='Helvetica', fontSize=8, textColor=TEXT_MUTED, alignment=1
    ))
    story.append(footer_text)

    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
