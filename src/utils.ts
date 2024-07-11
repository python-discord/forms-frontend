export function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();
    str = str
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    return str;
}

export function humanize(num: number) {
    if (num % 100 >= 11 && num % 100 <= 13) return num + "th";

    switch (num % 10) {
        case 1:
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd";
    }

    return num + "th";
}
