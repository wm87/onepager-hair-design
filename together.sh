#!/bin/bash

# Pfad zum Ordner (anpassen)
FOLDER="/data/github/onepager-hair-design"

# Ausgabedateien
OUTPUT_HTML="$FOLDER/html_files.txt"
OUTPUT_CSS="$FOLDER/css_files.txt"
OUTPUT_JS="$FOLDER/js_files.txt"

# Alte Ausgabedateien löschen, falls vorhanden
rm -f "$OUTPUT_HTML" "$OUTPUT_CSS" "$OUTPUT_JS"

# Funktion zum Anhängen von Dateien nach Typ
append_files_by_type() {
    local ext=$1
    local output_file=$2

    find "$FOLDER" -type f -name "*.$ext" | sort | while read -r FILE; do
        echo -e "\n===== $(basename "$FILE") =====\n" >>"$output_file"
        cat "$FILE" >>"$output_file" 2>/dev/null
    done
}

# HTML-Dateien
append_files_by_type "html" "$OUTPUT_HTML"

# CSS-Dateien
append_files_by_type "css" "$OUTPUT_CSS"

# JS-Dateien
append_files_by_type "js" "$OUTPUT_JS"

echo "Fertig! Inhalte wurden in:"
echo "  $OUTPUT_HTML"
echo "  $OUTPUT_CSS"
echo "  $OUTPUT_JS"
