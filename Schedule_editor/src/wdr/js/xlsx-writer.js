        /* ---- Minimaler XLSX-Schreiber (Werte, Formeln, Stile, Diagramme) ---- */
        const XL_MAIN_NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
        const XL_STYLE = { normal: 0, bold: 1, header: 2, number: 3, stat: 4, flag: 5, note: 6, flagNumber: 7, ok: 8, duration: 9, boldNumber: 10, boldDuration: 11, number3: 12 };

        function xlEscape(text) {
            return String(text)
                .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        }

        function xlColumnName(index) {
            let name = "";
            let value = index + 1;
            while (value > 0) {
                const rest = (value - 1) % 26;
                name = String.fromCharCode(65 + rest) + name;
                value = Math.floor((value - 1) / 26);
            }
            return name;
        }

        function xlNumberText(value) {
            if (!Number.isFinite(value)) return null;
            return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
        }

        // Ein Arbeitsblatt, zeilenweise geschrieben; der XML-Text wird in Bloecken zu Blobs zusammengefasst.
        class XlSheet {
            constructor(name, options = {}) {
                this.name = name.replace(/[\[\]:*?/\\]/g, " ").slice(0, 31);
                this.options = options;
                this.parts = [];
                this.chunk = [];
                this.chunkLength = 0;
            }
            // ref: ' r="B7"' oder "" (Zelle direkt nach der vorigen – spart bei grossen Blaettern ein Viertel der Datei)
            cellXml(ref, cell) {
                if (cell === null || cell === undefined || cell === "") return "";
                if (typeof cell === "number") {
                    const text = xlNumberText(cell);
                    return text === null ? "" : `<c${ref}><v>${text}</v></c>`;
                }
                if (typeof cell === "string") {
                    return `<c${ref} t="inlineStr"><is><t xml:space="preserve">${xlEscape(cell)}</t></is></c>`;
                }
                const style = cell.s ? ` s="${cell.s}"` : "";
                if (cell.f) {
                    const cached = typeof cell.v === "number" ? xlNumberText(cell.v) : null;
                    if (typeof cell.v === "string") return `<c${ref}${style} t="str"><f>${xlEscape(cell.f)}</f><v>${xlEscape(cell.v)}</v></c>`;
                    return `<c${ref}${style}><f>${xlEscape(cell.f)}</f>${cached === null ? "" : `<v>${cached}</v>`}</c>`;
                }
                if (typeof cell.v === "number") {
                    const text = xlNumberText(cell.v);
                    return text === null ? (style ? `<c${ref}${style}/>` : "") : `<c${ref}${style}><v>${text}</v></c>`;
                }
                if (cell.v === undefined || cell.v === null || cell.v === "") return style ? `<c${ref}${style}/>` : "";
                return `<c${ref}${style} t="inlineStr"><is><t xml:space="preserve">${xlEscape(cell.v)}</t></is></c>`;
            }
            row(rowNumber, cells, height) {
                let xml = `<row r="${rowNumber}"${height ? ` ht="${height}" customHeight="1"` : ""}>`;
                let previous = -1;
                for (let index = 0; index < cells.length; index++) {
                    const ref = index === previous + 1 ? "" : ` r="${xlColumnName(index)}${rowNumber}"`;
                    const cellXml = this.cellXml(ref, cells[index]);
                    if (cellXml) {
                        xml += cellXml;
                        previous = index;
                    }
                }
                xml += "</row>";
                this.chunk.push(xml);
                this.chunkLength += xml.length;
                if (this.chunkLength > 2000000) this.flush();
            }
            flush() {
                if (!this.chunk.length) return;
                this.parts.push(new Blob([this.chunk.join("")]));
                this.chunk = [];
                this.chunkLength = 0;
            }
            toBlob() {
                this.flush();
                const options = this.options;
                let head = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet ${XL_MAIN_NS}>`;
                head += `<sheetViews><sheetView workbookViewId="0"${options.selected ? ' tabSelected="1"' : ""}${options.zoom ? ` zoomScale="${options.zoom}"` : ""}>`;
                if (options.freezeRows) {
                    head += `<pane ySplit="${options.freezeRows}" topLeftCell="A${options.freezeRows + 1}" activePane="bottomLeft" state="frozen"/>`;
                }
                head += "</sheetView></sheetViews><sheetFormatPr defaultRowHeight=\"15\"/>";
                if (options.widths && options.widths.length) {
                    head += "<cols>" + options.widths.map((width, index) => width ? `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>` : "").join("") + "</cols>";
                }
                head += "<sheetData>";
                const foot = "</sheetData>"
                    + (options.ignoreFormulaRange ? `<ignoredErrors><ignoredError sqref="${options.ignoreFormulaRange}" formulaRange="1"/></ignoredErrors>` : "")
                    + (options.drawing ? '<drawing r:id="rId1"/>' : "") + "</worksheet>";
                return new Blob([head, ...this.parts, foot], { type: "application/xml" });
            }
        }

        const XL_STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="3"><numFmt numFmtId="164" formatCode="0.00"/><numFmt numFmtId="165" formatCode="[h]:mm:ss"/><numFmt numFmtId="166" formatCode="0.000"/></numFmts><fonts count="5"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FFC00000"/><name val="Calibri"/><family val="2"/></font><font><i/><sz val="10"/><color rgb="FF6E6259"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FF2E7D32"/><name val="Calibri"/><family val="2"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFCE4D6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="13"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="1" fillId="2" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="164" fontId="2" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/><xf numFmtId="165" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

        // Streudiagramm (x: Zeit in min) mit Linien ohne Marker.
        function xlScatterChartXml({ title, xTitle, yTitle, series }) {
            const rich = (text, size, bold) => `<c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="${size}" b="${bold ? 1 : 0}"/></a:pPr><a:r><a:rPr lang="en-US" sz="${size}" b="${bold ? 1 : 0}"/><a:t>${xlEscape(text)}</a:t></a:r></a:p></c:rich></c:tx>`;
            const axis = (id, crossId, position, axisTitle, gridlines) => `<c:valAx><c:axId val="${id}"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="${position}"/>${gridlines ? '<c:majorGridlines><c:spPr><a:ln w="6350"><a:solidFill><a:srgbClr val="E3D9CF"/></a:solidFill></a:ln></c:spPr></c:majorGridlines>' : ""}<c:title>${rich(axisTitle, 1000, false)}<c:overlay val="0"/></c:title><c:numFmt formatCode="${position === "b" ? "0.0" : "0.00"}" sourceLinked="0"/><c:majorTickMark val="out"/><c:minorTickMark val="none"/><c:tickLblPos val="low"/><c:crossAx val="${crossId}"/><c:crosses val="autoZero"/><c:crossBetween val="midCat"/></c:valAx>`;
            const seriesXml = series.map((item, index) => `<c:ser><c:idx val="${index}"/><c:order val="${index}"/><c:tx><c:v>${xlEscape(item.name)}</c:v></c:tx><c:spPr><a:ln w="${item.width || 9525}"><a:solidFill><a:srgbClr val="${item.color}"/></a:solidFill>${item.dash ? `<a:prstDash val="${item.dash}"/>` : ""}</a:ln></c:spPr><c:marker><c:symbol val="none"/></c:marker><c:xVal><c:numRef><c:f>${xlEscape(item.x)}</c:f></c:numRef></c:xVal><c:yVal><c:numRef><c:f>${xlEscape(item.y)}</c:f></c:numRef></c:yVal><c:smooth val="0"/></c:ser>`).join("");
            return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><c:roundedCorners val="0"/><c:chart><c:title>${rich(title, 1200, true)}<c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/><c:scatterChart><c:scatterStyle val="lineMarker"/><c:varyColors val="0"/>${seriesXml}<c:axId val="5001"/><c:axId val="5002"/></c:scatterChart>${axis(5001, 5002, "b", xTitle, false)}${axis(5002, 5001, "l", yTitle, true)}</c:plotArea><c:legend><c:legendPos val="b"/><c:overlay val="0"/></c:legend><c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart></c:chartSpace>`;
        }

        // Baut die xlsx-Datei. sheets: [{ sheet: XlSheet, charts?: [{ xml, from: [col,row], to: [col,row] }] }]
        async function xlBuildWorkbook(sheets) {
            const zip = new JSZip();
            const addPart = (name, data) => zip.file(name, data, { createFolders: false }); // ohne Ordnereintraege
            const contentTypes = ['<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>', '<Default Extension="xml" ContentType="application/xml"/>',
                '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
                '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'];
            const workbookRels = [];
            const sheetEntries = [];
            let chartNumber = 0;
            let drawingNumber = 0;
            sheets.forEach((entry, index) => {
                const number = index + 1;
                contentTypes.push(`<Override PartName="/xl/worksheets/sheet${number}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`);
                workbookRels.push(`<Relationship Id="rId${number}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${number}.xml"/>`);
                sheetEntries.push(`<sheet name="${xlEscape(entry.sheet.name)}" sheetId="${number}" r:id="rId${number}"/>`);
                if (entry.charts && entry.charts.length) {
                    entry.sheet.options.drawing = true;
                    drawingNumber++;
                    addPart(`xl/worksheets/_rels/sheet${number}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${drawingNumber}.xml"/></Relationships>`);
                    contentTypes.push(`<Override PartName="/xl/drawings/drawing${drawingNumber}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`);
                    const anchors = [];
                    const drawingRels = [];
                    entry.charts.forEach((chart, chartIndex) => {
                        chartNumber++;
                        addPart(`xl/charts/chart${chartNumber}.xml`, chart.xml);
                        contentTypes.push(`<Override PartName="/xl/charts/chart${chartNumber}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`);
                        drawingRels.push(`<Relationship Id="rId${chartIndex + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${chartNumber}.xml"/>`);
                        anchors.push(`<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>${chart.from[0]}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${chart.from[1]}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${chart.to[0]}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${chart.to[1]}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${chartIndex + 2}" name="Chart ${chartIndex + 1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" r:id="rId${chartIndex + 1}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`);
                    });
                    addPart(`xl/drawings/drawing${drawingNumber}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${anchors.join("")}</xdr:wsDr>`);
                    addPart(`xl/drawings/_rels/drawing${drawingNumber}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${drawingRels.join("")}</Relationships>`);
                }
                addPart(`xl/worksheets/sheet${number}.xml`, entry.sheet.toBlob());
            });
            workbookRels.push(`<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`);
            addPart("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${contentTypes.join("")}</Types>`);
            addPart("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
            addPart("xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook ${XL_MAIN_NS}><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheetEntries.join("")}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`);
            addPart("xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${workbookRels.join("")}</Relationships>`);
            addPart("xl/styles.xml", XL_STYLES);
            return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 5 }, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        }

