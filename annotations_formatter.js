module.exports = function (results) {
    let output = "";

    for (const file of results.filter(r => r.messages.length > 0)) {
        for (const message of file.messages) {
            const path = file.filePath.substr(process.cwd().length + 1);
            const severity = message.fatal || message.severity === 2 ? "error" : "warning";
            const text = `[ESLint] ${message.ruleId}: ${message.message}`;
            output += `::${severity} file=${path},line=${message.line},col=${message.column}::${text}\n`;
        }
    }

    return output;
};
