def generate_advice(savings_data, expense_summary, bills):
    rules = []

    savings_rate = savings_data.get("savings_rate", 0)
    savings = savings_data.get("savings", 0)

    # savings rates rules
    if savings_rate <0:
        rules.append(("critical", " you have spent more than youve earnt this month, Dougal is worried about your financial security :-("))
    elif savings_rate < 10:
        rules.append(("warning", "savings are looking thin this month, Small cuts add up!"))
    elif savings_rate >= 10 and savings_rate < 20:
        rules.append(("info", "youre saving some but theres still room to grow, keep it up!"))
    elif savings_rate >= 20 and savings_rate < 30:
        rules.append(("positive", "solid savings this month dougal is pleased :-)"))
    elif savings_rate >= 30:
        rules.append(("positive", " WOW over 30% savings rate? dougal very happpy :-)"))

    # overdue bills
    overdue = [b for b in bills if b.get("status") == "overdue"]
    if overdue:
        rules.append(("critical", f"you have {len(overdue)} overdue bill(s). sort those out ASAP!"))

    #upcoming bills
    upcoming = [b for b in bills if b.get("status") == "upcoming"]
    if upcoming:
        names = ", ".join(b["title"] for b in upcoming[:2])
        rules.append(("warning", f"{names} {'is' if len(upcoming) == 1 else 'are'} due within 7 days"))

    # category rules
    category_map = {item["category"]: item["total"] for item in expense_summary}

    
    if category_map.get("Lifestyle", 0) > category_map.get("Food", 0) * 2:
        rules.append(("warning", "You're spending a lot more on Lifestyle than Food this month. Worth a look."))

    if category_map.get("Other", 0) > 200:
        rules.append(("info", "You have a lot of uncategorized spending. Want to sort through it?"))

    if category_map.get("Transport", 0) > 150:
        rules.append(("info", "Transport costs are adding up this month."))

    if category_map.get("Health", 0) > 0:
        rules.append(("positive", "Good to see you investing in your health this month."))

    # net saving milestone rules
    if savings >= 1000:
        rules.append(("positive", "you have saved over $1000 all up, dougal is very proud"))
    elif savings >= 500:
        rules.append(("positive","over $500 saved total, youre starting to grow, happy dougal :)"))

    #picking rule based off priority
    for priority in ["critical", "warning", "info", "positive"]:
        for rule in rules:
            if rule[0] == priority:
                return {"priority": priority, "message": rule[1]}
            
    return {"priority": "positive", "message": "Everything looks good this month. Dougal approves."}