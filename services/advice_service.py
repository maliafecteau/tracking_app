def generate_advice(savings_data, expense_summary, bills):
    rules = []

    savings_rate = savings_data.get("savings_rate", 0)
    savings = savings_data.get("savings", 0)

    # savings rate rules
    if savings_rate < 0:
        rules.append((
            "critical",
            "You have spent more than you earned this month. Dougal is worried about your financial security."
        ))
    elif savings_rate < 10:
        rules.append((
            "warning",
            "Savings are looking thin this month. Small cuts add up."
        ))
    elif savings_rate < 20:
        rules.append((
            "info",
            "You are saving some money, but there is still room to grow. Keep it up."
        ))
    elif savings_rate < 30:
        rules.append((
            "positive",
            "Solid savings this month. Dougal is pleased."
        ))
    else:
        rules.append((
            "positive",
            "Wow, over 30% savings rate. Dougal is very happy."
        ))

    # overdue bills
    overdue = [b for b in bills if b.get("status") == "overdue"]
    if overdue:
        rules.append((
            "critical",
            f"You have {len(overdue)} overdue bill(s). Sort those out as soon as possible."
        ))

    # upcoming bills
    upcoming = [b for b in bills if b.get("status") == "upcoming"]
    if upcoming:
        names = ", ".join(b["title"] for b in upcoming[:2])
        rules.append((
            "warning",
            f"{names} {'is' if len(upcoming) == 1 else 'are'} due within 7 days."
        ))

    # category rules
    category_map = {item["category"]: item["total"] for item in expense_summary}

    if category_map.get("Lifestyle", 0) > category_map.get("Food", 0) * 2:
        rules.append((
            "warning",
            "Lifestyle spending is much higher than food spending this month. Worth a look."
        ))

    if category_map.get("Other", 0) > 200:
        rules.append((
            "info",
            "You have a lot of uncategorized spending. Dougal thinks you should sort through it."
        ))

    if category_map.get("Transport", 0) > 150:
        rules.append((
            "info",
            "Transport costs are adding up this month."
        ))

    if category_map.get("Health", 0) > 0:
        rules.append((
            "positive",
            "Good to see you investing in your health this month."
        ))

    # net saving milestone rules
    if savings >= 1000:
        rules.append((
            "positive",
            "You have saved over $1000 all up. Dougal is proud."
        ))
    elif savings >= 500:
        rules.append((
            "positive",
            "Over $500 saved total. You are starting to grow your money."
        ))

    if not rules:
        rules.append((
            "positive",
            "Everything looks good this month. Dougal approves."
        ))

    priority_order = {
        "critical": 0,
        "warning": 1,
        "info": 2,
        "positive": 3,
    }

    sorted_rules = sorted(rules, key=lambda rule: priority_order[rule[0]])

    return {
        "priority": sorted_rules[0][0],
        "message": sorted_rules[0][1],
        "messages": [
            {
                "priority": priority,
                "message": message
            }
            for priority, message in sorted_rules
        ]
    }