//import CodeMirror from "codemirror";

window.CodeMirror.keyMap.live = {
    fallthrough: "default",
    "Ctrl-Enter": function (cm) {
        const obj = getSelectionCodeColumn(cm, false);
        //eval(obj.code);
        setComp(obj.code);
        flash(cm, obj.selection);
    }
};

const cm = new window.CodeMirror(document.querySelector("#editorA"), {
    lineNumbers: true,
    autofocus: true,
    mode: "javascript",
    keyMap: "live",
    value: ''
});

function getSelectionCodeColumn(cm, findBlock) {
    let pos = cm.getCursor(),
        text = null;

    if (!findBlock) {
        text = cm.getDoc().getSelection();

        if (text === "") {
            text = cm.getLine(pos.line);
        } else {
            pos = { start: cm.getCursor("start"), end: cm.getCursor("end") };
            //pos = null
        }
    } else {
        let startline = pos.line,
            endline = pos.line,
            pos1,
            pos2,
            sel;

        while (startline > 0 && cm.getLine(startline) !== "") {
            startline--;
        }
        while (endline < cm.lineCount() && cm.getLine(endline) !== "") {
            endline++;
        }

        pos1 = { line: startline, ch: 0 };
        pos2 = { line: endline, ch: 0 };

        text = cm.getRange(pos1, pos2);

        pos = { start: pos1, end: pos2 };
    }

    if (pos.start === undefined) {
        let lineNumber = pos.line,
            start = 0,
            end = text.length;

        pos = {
            start: { line: lineNumber, ch: start },
            end: { line: lineNumber, ch: end }
        };
    }

    return { selection: pos, code: text };
}

const flash = function (cm, pos) {
    let sel,
        cb = function () {
            sel.clear();
        };

    if (pos !== null) {
        if (pos.start) {
            // if called from a findBlock keymap
            sel = cm.markText(pos.start, pos.end, {
                className: "CodeMirror-highlight"
            });
        } else {
            // called with single line
            sel = cm.markText(
                { line: pos.line, ch: 0 },
                { line: pos.line, ch: null },
                { className: "CodeMirror-highlight" }
            );
        }
    } else {
        // called with selected block
        sel = cm.markText(cm.getCursor(true), cm.getCursor(false), {
            className: "CodeMirror-highlight"
        });
    }

    window.setTimeout(cb, 250);
};

function setComp(code) {
    alert("alert")
    eval(code);
}