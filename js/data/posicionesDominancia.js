export const segmentosCoronarios = [
  // Arteria Coronaria Derecha (ACD)
  { id: 1, name: "Segmento 1: ACD, Proximal (pACD)", longName: "Arteria Coronaria Derecha, Proximal" },
  { id: 2, name: "Segmento 2: ACD, Media (mACD)", longName: "Arteria Coronaria Derecha, Media" },
  { id: 21, name: "Segmento 2.1: Rama Marginal Aguda (RMA)", longName: "Rama Marginal Aguda" },
  { id: 3, name: "Segmento 3: ACD, Distal (dACD)", longName: "Arteria Coronaria Derecha, Distal" },
  { id: 4, name: "Segmento 4: Arteria Descendente Posterior (ADP)", longName: "Arteria Descendente Posterior" },
  { id: 16, name: "Segmento 16: Rama Posterolateral Derecha (RPLD)", longName: "Rama Posterolateral Derecha" },
  // Tronco Coronario Izquierdo (TCI)
  { id: 5, name: "Segmento 5: Tronco Coronario Izquierdo (TCI)", longName: "Tronco Coronario Izquierdo" },
  // Arteria Descendente Anterior (ADA) y Ramas
  { id: 6, name: "Segmento 6: ADA, Proximal (pADA)", longName: "Descendente Anterior, Proximal" },
  { id: 7, name: "Segmento 7: ADA, Media (mADA)", longName: "Descendente Anterior, Media" },
  { id: 8, name: "Segmento 8: ADA, Distal/Apical (dADA)", longName: "Descendente Anterior, Distal/Apical" },
  { id: 9, name: "Segmento 9: Primera Diagonal (D1)", longName: "Primera Rama Diagonal" },
  { id: 10, name: "Segmento 10: Segunda Diagonal (D2)", longName: "Segunda Rama Diagonal" },
  { id: 101, name: "Segmento 10.1: Tercera Diagonal (D3)", longName: "Tercera Rama Diagonal" },
  // Arteria Circunfleja (ACx) y Ramas
  { id: 11, name: "Segmento 11: ACx, Proximal (pACx)", longName: "Arteria Circunfleja, Proximal" },
  { id: 125, name: "Segmento 12.5: Rama Intermedia (RI)", longName: "Rama Intermedia" },
  { id: 12, name: "Segmento 12: Primera Obtusa Marginal (OM1)", longName: "Primera Rama Obtusa Marginal" },
  { id: 121, name: "Segmento 12.1: Segunda Obtusa Marginal (OM2)", longName: "Segunda Rama Obtusa Marginal" },
  { id: 122, name: "Segmento 12.2: Tercera Obtusa Marginal (OM3)", longName: "Tercera Rama Obtusa Marginal" },
  { id: 13, name: "Segmento 13: ACx, Distal (dACx)", longName: "Arteria Circunfleja, Distal" },
  { id: 14, name: "Segmento 14: Rama Posterolateral Izquierda (RPLI)", longName: "Rama Posterolateral Izquierda" },
  { id: 15, name: "Segmento 15: Descendente Posterior Izquierda (DPI)", longName: "Descendente Posterior Izquierda" }
];

export const posicionesDerecha = [
  { id: 1, name: "CDp", points: [[250, 125], [160, 130], [140, 140]], dominance: ["derecha", "codominancia"], labelPos: { x: 170, y: 120 }, transform: "translate(0,0) rotate(0)" },
  { id: 2, name: "CDm", points: [[140, 140], [120, 170], [115, 190]], dominance: ["derecha", "codominancia"], labelPos: { x: 125, y: 160 }, transform: "translate(0,0) rotate(0)" },
  { id: 21, name: "RMA", points: [[105, 170], [75, 185], [60, 195]], dominance: ["derecha", "codominancia"], labelPos: { x: 80, y: 175 }, transform: "translate(0,0) rotate(0)" },
  { id: 3, name: "CDd", points: [[115, 190], [120, 200], [125, 205]], dominance: ["derecha"], labelPos: { x: 120, y: 195 }, transform: "translate(0,0) rotate(0)" },
  { id: 4, name: "ADP", points: [[120, 280], [130, 300], [140, 320]], dominance: ["derecha", "codominancia"], labelPos: { x: 125, y: 300 }, transform: "translate(20, -20) rotate(0)" },
  { id: 5, name: "TCI", points: [[205, 120], [210, 140]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 220, y: 130 }, transform: "translate(0,0) rotate(0)" },
  { id: 6, name: "DAp", points: [[210, 140], [230, 220]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 230, y: 180 }, transform: "translate(0,0) rotate(0)" },
  { id: 7, name: "DAm", points: [[230, 220], [240, 280]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 245, y: 250 }, transform: "translate(0,0) rotate(0)" },
  { id: 8, name: "DAd", points: [[240, 280], [250, 330]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 260, y: 305 }, transform: "translate(0,0) rotate(0)" },
  { id: 9, name: "D1", points: [[230, 220], [270, 205], [280, 200]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 260, y: 215 }, transform: "translate(0,0) rotate(0)" },
  { id: 10, name: "D2", points: [[235, 250], [275, 240], [285, 235]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 265, y: 245 }, transform: "translate(0,0) rotate(0)" },
  { id: 101, name: "D3", points: [[235, 270], [275, 260], [285, 255]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 265, y: 265 }, transform: "translate(8.1395263671875, 25.581405639648438) rotate(0, 260, 242.5)" },
  { id: 11, name: "CXp", points: [[210, 140], [180, 170], [170, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 185, y: 155 }, transform: "translate(0,0) rotate(0)" },
  { id: 12, name: "OM1", points: [[170, 180], [130, 170], [120, 160]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 165 }, transform: "translate(0,0) rotate(0)" },
  { id: 121, name: "OM2", points: [[170, 200], [130, 190], [120, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 185 }, transform: "translate(0,0) rotate(0)" },
  { id: 122, name: "OM3", points: [[170, 220], [130, 210], [120, 200]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 205 }, transform: "translate(0,0) rotate(0)" },
  { id: 125, name: "RI", points: [[220, 150], [200, 170], [190, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 205, y: 160 }, transform: "translate(0,0) rotate(0)" },
  { id: 13, name: "CXd", points: [[170, 180], [155, 230], [150, 270], [140, 300]], dominance: ["izquierda"], labelPos: { x: 155, y: 240 }, transform: "translate(0,0) rotate(0)" },
  { id: 14, name: "RPLI", dominance: ["izquierda", "codominancia"], labelPos: { x: 130, y: 300 }, transform: "translate(0,0) rotate(0)", points: [[140, 300], [120, 310], [110, 315]] },
  { id: 15, name: "DPI", dominance: ["izquierda"], labelPos: { x: 150, y: 320 }, transform: "translate(0,0) rotate(0)", points: [[140, 300], [150, 330], [160, 350]] },
  { id: 16, name: "RPLD", points: [[120, 280], [80, 295], [70, 300]], dominance: ["derecha"], labelPos: { x: 95, y: 290 }, transform: "translate(0,0) rotate(0)" }
];
export const posicionesIzquierda = [
  { id: 1, name: "CDp", points: [[250, 125], [160, 130], [140, 140]], dominance: ["derecha", "codominancia"], labelPos: { x: 170, y: 120 }, transform: "translate(0,0) rotate(0)" },
  { id: 2, name: "CDm", points: [[140, 140], [120, 170], [115, 190]], dominance: ["derecha", "codominancia"], labelPos: { x: 125, y: 160 }, transform: "translate(0,0) rotate(0)" },
  { id: 21, name: "RMA", points: [[105, 170], [75, 185], [60, 195]], dominance: ["derecha", "codominancia"], labelPos: { x: 80, y: 175 }, transform: "translate(0,0) rotate(0)" },
  { id: 3, name: "CDd", points: [[115, 190], [120, 200], [125, 205]], dominance: ["derecha"], labelPos: { x: 120, y: 195 }, transform: "translate(0,0) rotate(0)" },
  { id: 4, name: "ADP", points: [[120, 280], [130, 300], [140, 320]], dominance: ["derecha", "codominancia"], labelPos: { x: 125, y: 300 }, transform: "translate(20, -20) rotate(0)" },
  { id: 5, name: "TCI", points: [[205, 120], [210, 140]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 220, y: 130 }, transform: "translate(0,0) rotate(0)" },
  { id: 6, name: "DAp", points: [[210, 140], [230, 220]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 230, y: 180 }, transform: "translate(0,0) rotate(0)" },
  { id: 7, name: "DAm", points: [[230, 220], [240, 280]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 245, y: 250 }, transform: "translate(0,0) rotate(0)" },
  { id: 8, name: "DAd", points: [[240, 280], [250, 330]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 260, y: 305 }, transform: "translate(0,0) rotate(0)" },
  { id: 9, name: "D1", points: [[230, 220], [270, 205], [280, 200]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 260, y: 215 }, transform: "translate(0,0) rotate(0)" },
  { id: 10, name: "D2", points: [[235, 250], [275, 240], [285, 235]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 265, y: 245 }, transform: "translate(0,0) rotate(0)" },
  { id: 101, name: "D3", points: [[235, 270], [275, 260], [285, 255]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 265, y: 265 }, transform: "translate(8.1395263671875, 25.581405639648438) rotate(0, 260, 242.5)" },
  { id: 11, name: "CXp", points: [[210, 140], [180, 170], [170, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 185, y: 155 }, transform: "translate(0,0) rotate(0)" },
  { id: 12, name: "OM1", points: [[170, 180], [130, 170], [120, 160]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 165 }, transform: "translate(0,0) rotate(0)" },
  { id: 121, name: "OM2", points: [[170, 200], [130, 190], [120, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 185 }, transform: "translate(0,0) rotate(0)" },
  { id: 122, name: "OM3", points: [[170, 220], [130, 210], [120, 200]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 205 }, transform: "translate(0,0) rotate(0)" },
  { id: 125, name: "RI", points: [[220, 150], [200, 170], [190, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 205, y: 160 }, transform: "translate(0,0) rotate(0)" },
  { id: 13, name: "CXd", points: [[170, 180], [155, 230], [150, 270], [140, 300]], dominance: ["izquierda"], labelPos: { x: 155, y: 240 }, transform: "translate(0,0) rotate(0)" },
  { id: 14, name: "RPLI", dominance: ["izquierda", "codominancia"], labelPos: { x: 130, y: 300 }, transform: "translate(0,0) rotate(0)", points: [[140, 300], [120, 310], [110, 315]] },
  { id: 15, name: "DPI", dominance: ["izquierda"], labelPos: { x: 150, y: 320 }, transform: "translate(0,0) rotate(0)", points: [[140, 300], [150, 330], [160, 350]] },
  { id: 16, name: "RPLD", points: [[120, 280], [80, 295], [70, 300]], dominance: ["derecha"], labelPos: { x: 95, y: 290 }, transform: "translate(0,0) rotate(0)" }
];

export const posicionesCodominancia = [
  { id: 1, name: "CDp", points: [[190, 125], [160, 130], [120, 150]], dominance: ["derecha", "codominancia"], labelPos: { x: 150, y: 125 }, transform: "translate(0,0) rotate(0)" },
  { id: 2, name: "CDm", points: [[120, 150], [90, 200], [80, 220]], dominance: ["derecha", "codominancia"], labelPos: { x: 95, y: 180 }, transform: "translate(0,0) rotate(0)" },
  { id: 21, name: "RMA", points: [[80, 220], [110, 270], [120, 280]], dominance: ["derecha", "codominancia"], labelPos: { x: 80, y: 175 }, transform: "translate(0,0) rotate(0)" },
  { id: 3, name: "CDd", points: [[80, 220], [110, 270], [120, 280]], dominance: ["derecha"], labelPos: { x: 100, y: 250 }, transform: "translate(-10, 5) rotate(0)" },
  { id: 4, name: "ADP", points: [[120, 280], [130, 300], [140, 320]], dominance: ["derecha", "codominancia"], labelPos: { x: 125, y: 300 }, transform: "translate(0,0) rotate(0)" },
  { id: 5, name: "TCI", points: [[205, 120], [210, 140]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 220, y: 130 }, transform: "translate(0,0) rotate(0)" },
  { id: 6, name: "DAp", points: [[210, 140], [230, 220]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 230, y: 180 }, transform: "translate(0,0) rotate(0)" },
  { id: 7, name: "DAm", points: [[230, 220], [240, 280]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 245, y: 250 }, transform: "translate(0,0) rotate(0)" },
  { id: 8, name: "DAd", points: [[240, 280], [250, 330]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 260, y: 305 }, transform: "translate(0,0) rotate(0)" },
  { id: 9, name: "D1", points: [[230, 220], [270, 205], [280, 200]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 260, y: 215 }, transform: "translate(0,0) rotate(0)" },
  { id: 10, name: "D2", points: [[235, 250], [275, 240], [285, 235]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 265, y: 245 }, transform: "translate(0,0) rotate(0)" },
  { id: 101, name: "D3", points: [[235, 270], [275, 260], [285, 255]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 265, y: 265 }, transform: "translate(8.1395263671875, 25.581405639648438) rotate(0, 260, 242.5)" },
  { id: 11, name: "CXp", points: [[210, 140], [180, 170], [170, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 185, y: 155 }, transform: "translate(0,0) rotate(0)" },
  { id: 12, name: "OM1", points: [[170, 180], [130, 170], [120, 160]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 165 }, transform: "translate(0,0) rotate(0)" },
  { id: 121, name: "OM2", points: [[170, 200], [130, 190], [120, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 185 }, transform: "translate(0,0) rotate(0)" },
  { id: 122, name: "OM3", points: [[170, 220], [130, 210], [120, 200]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 145, y: 205 }, transform: "translate(0,0) rotate(0)" },
  { id: 125, name: "RI", points: [[220, 150], [200, 170], [190, 180]], dominance: ["derecha", "izquierda", "codominancia"], labelPos: { x: 205, y: 160 }, transform: "translate(0,0) rotate(0)" },
  { id: 13, name: "CXd", points: [[170, 180], [155, 230], [160, 260]], dominance: ["izquierda"], labelPos: { x: 155, y: 220 }, transform: "translate(0,0) rotate(0)" },
  { id: 14, name: "RPLI", dominance: ["izquierda", "codominancia"], labelPos: { x: 150, y: 290 }, transform: "translate(0,0) rotate(0)", points: [[160, 260], [145, 300], [140, 320]] },
  { id: 15, name: "DPI", dominance: ["izquierda"], labelPos: { x: 150, y: 290 }, transform: "translate(0,0) rotate(0)", points: [[160, 260], [145, 300], [140, 320]] },
  { id: 16, name: "RPLD", points: [[120, 280], [80, 295], [70, 300]], dominance: ["derecha"], labelPos: { x: 95, y: 290 }, transform: "translate(0,0) rotate(0)" }
];

export const dominanciaData = {
  derecha: { positions: posicionesDerecha, image: "../../img/DomDerechConNumeros.png" },
  izquierda: { positions: posicionesIzquierda, image: "../../img/DomIzqConNumeros.png" },
  codominancia: { positions: posicionesCodominancia, image: "../../img/corazonSinetiquetas.png" }
};