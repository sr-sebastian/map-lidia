import React, { useState, useCallback, useMemo, useEffect } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const MATERIAS = [
  // Semestre 1
  {id:"INT",semestre:1,nombre:"Introducción a la Ing. de Datos e IA",creditos:4,previaturas:[],programa_analitico:"Comprensión general de la carrera y conceptos fundamentales del ciclo de vida de los datos, ética profesional y aplicaciones actuales de la IA.",bibliografia_recomendada:["Material provisto por el equipo docente de UTEC","Artículos de investigación actuales sobre tendencias en IA"]},
  {id:"FIS",semestre:1,nombre:"Física para Ingeniería de Datos e IA",creditos:10,previaturas:[],programa_analitico:"Fundamentos de mecánica clásica, electromagnetismo y ondas, con enfoque en la resolución de problemas lógicos aplicables al modelado de sistemas físicos en ciencias de datos.",bibliografia_recomendada:["Física universitaria (Vol. 1 y 2) - Sears & Zemansky","Física para ciencias e ingeniería - Serway, R. A., & Jewett, J. W."]},
  {id:"PRO1",semestre:1,nombre:"Programación I",creditos:8,previaturas:[],programa_analitico:"Fundamentos de programación, lógica computacional, estructuras de control, funciones y manipulación básica de archivos (Enfoque Python).",bibliografia_recomendada:["Think Python: How to Think Like a Computer Scientist - Allen B. Downey","Python Crash Course - Eric Matthes"]},
  {id:"MDI",semestre:1,nombre:"Matemática Discreta",creditos:8,previaturas:[],programa_analitico:"Lógica proposicional, teoría de conjuntos, relaciones, funciones, combinatoria, teoría de números y teoría de grafos, fundamentales para algoritmia.",bibliografia_recomendada:["Matemática Discreta y sus Aplicaciones - Kenneth H. Rosen","Matemáticas Discretas - Richard Johnsonbaugh"]},
  {id:"MAT1",semestre:1,nombre:"Matemática I",creditos:10,previaturas:[],programa_analitico:"Cálculo diferencial e integral en una variable. Límites, derivadas, integrales y sus aplicaciones en la optimización de funciones.",bibliografia_recomendada:["Cálculo: Trascendentes tempranas - James Stewart","Cálculo de una variable - George B. Thomas"]},
  {id:"ING1",semestre:1,nombre:"Inglés I",creditos:4,previaturas:[],programa_analitico:"Desarrollo de habilidades comunicativas básicas en el idioma inglés, con enfoque en lectura de textos técnicos elementales.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 2
  {id:"EDA",semestre:2,nombre:"Estructuras de Datos y Algoritmos",creditos:8,previaturas:["MDI","PRO1"],programa_analitico:"Diseño y análisis de estructuras de datos (listas, pilas, colas, árboles, grafos) y algoritmos de búsqueda y ordenamiento. Complejidad computacional.",bibliografia_recomendada:["Introduction to Algorithms - Cormen, Leiserson, Rivest, and Stein","Estructuras de datos y algoritmos en Python - Goodrich, Tamassia & Goldwasser"]},
  {id:"PRO2",semestre:2,nombre:"Programación II",creditos:8,previaturas:["PRO1"],programa_analitico:"Programación orientada a objetos (POO), manejo de excepciones, interfaces gráficas básicas y patrones de diseño elementales.",bibliografia_recomendada:["Head First Object-Oriented Analysis and Design - Brett McLaughlin","Clean Code: A Handbook of Agile Software Craftsmanship - Robert C. Martin"]},
  {id:"MAT2",semestre:2,nombre:"Matemática II",creditos:10,previaturas:["MAT1"],programa_analitico:"Cálculo multivariable y vectorial. Derivadas parciales, integrales múltiples y cálculo vectorial aplicable a la física y al machine learning.",bibliografia_recomendada:["Cálculo: Varias variables - James Stewart","Cálculo vectorial - Jerrold E. Marsden, Anthony J. Tromba"]},
  {id:"ALL",semestre:2,nombre:"Álgebra Lineal",creditos:8,previaturas:["MAT1"],programa_analitico:"Sistemas de ecuaciones lineales, matrices, determinantes, espacios vectoriales, transformaciones lineales, valores y vectores propios.",bibliografia_recomendada:["Álgebra lineal y sus aplicaciones - David C. Lay","Álgebra Lineal - Stanley I. Grossman"]},
  {id:"ARC",semestre:2,nombre:"Arquitectura de Computadoras",creditos:8,previaturas:["PRO1"],programa_analitico:"Organización y funcionamiento interno de los sistemas de computación, representación de datos a bajo nivel, CPU, memoria y jerarquías.",bibliografia_recomendada:["Organización y arquitectura de computadores - William Stallings","Estructura y diseño de computadores - Patterson & Hennessy"]},
  {id:"ING2",semestre:2,nombre:"Inglés II",creditos:4,previaturas:["ING1"],programa_analitico:"Continuación del desarrollo de habilidades comunicativas en inglés, con mayor énfasis en la comprensión auditiva y lectura de documentación técnica.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 3
  {id:"SOP",semestre:3,nombre:"Sistemas Operativos",creditos:8,previaturas:["ARC"],programa_analitico:"Administración de procesos, gestión de memoria (paginación y virtualización), entrada/salida y sistemas de archivos.",bibliografia_recomendada:["Sistemas Operativos: Conceptos Fundamentales - Silberschatz, Galvin & Gagne","Sistemas Operativos Modernos - Andrew S. Tanenbaum"]},
  {id:"BDR",semestre:3,nombre:"Bases de Datos Relacionales",creditos:8,previaturas:["EDA"],programa_analitico:"Modelo Entidad-Relación, álgebra relacional, normalización y lenguaje SQL avanzado para la gestión y consulta de bases de datos.",bibliografia_recomendada:["Fundamentos de Bases de Datos - Silberschatz, Korth & Sudarshan","Sistemas de Bases de Datos: Un enfoque práctico - Thomas Connolly, Carolyn Begg"]},
  {id:"TALF",semestre:3,nombre:"Teoría de Autómatas y Lenguajes Formales",creditos:8,previaturas:["EDA"],programa_analitico:"Máquinas de estado finito, expresiones regulares, gramáticas libres de contexto y máquinas de Turing. Base para el procesamiento de lenguaje natural.",bibliografia_recomendada:["Introducción a la teoría de autómatas, lenguajes y computación - Hopcroft, Motwani & Ullman","Teoría de la computación - Michael Sipser"]},
  {id:"MNC",semestre:3,nombre:"Métodos Numéricos Computacionales",creditos:8,previaturas:["ALL","PRO2"],programa_analitico:"Resolución de ecuaciones no lineales, sistemas de ecuaciones, interpolación, integración y derivación numérica mediante programación.",bibliografia_recomendada:["Métodos numéricos para ingenieros - Steven C. Chapra, Raymond P. Canale","Análisis numérico - Richard L. Burden, J. Douglas Faires"]},
  {id:"PRE",semestre:3,nombre:"Probabilidad y Estadística",creditos:8,previaturas:["MDI","MAT1"],programa_analitico:"Análisis de datos, distribuciones de probabilidad discretas y continuas, muestreo, estimación y pruebas de hipótesis (base para el machine learning).",bibliografia_recomendada:["Probabilidad y estadística para ingeniería y ciencias - Jay L. Devore","Estadística matemática con aplicaciones - Wackerly, Mendenhall & Scheaffer"]},
  {id:"ING3",semestre:3,nombre:"Inglés III",creditos:4,previaturas:["ING2"],programa_analitico:"Desarrollo avanzado de habilidades comunicativas y redacción técnica en inglés, orientado a la presentación de proyectos y lectura de material académico.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 4
  {id:"AA1",semestre:4,nombre:"Aprendizaje Automático I",creditos:8,previaturas:["PRE"],programa_analitico:"Fundamentos del aprendizaje automático, regresión lineal y logística, clasificación, evaluación de modelos y preprocesamiento de datos.",bibliografia_recomendada:["Hands-On Machine Learning with Scikit-Learn - Aurélien Géron","Pattern Recognition and Machine Learning - Christopher M. Bishop"]},
  {id:"BDN",semestre:4,nombre:"Bases de Datos NoSQL",creditos:8,previaturas:["BDR"],programa_analitico:"Paradigma NoSQL, bases de datos orientadas a documentos, grafos, clave-valor y columnas. Escalabilidad y manejo de Big Data.",bibliografia_recomendada:["NoSQL Distilled - Pramod J. Sadalage, Martin Fowler","Seven Databases in Seven Weeks - Luc Perkins"]},
  {id:"TITD",semestre:4,nombre:"Teoría de la Info. y Transmisión de Datos",creditos:8,previaturas:["PRE"],programa_analitico:"Entropía, codificación de fuentes, capacidad de canal, técnicas de modulación y fundamentos de redes de transmisión.",bibliografia_recomendada:["Elements of Information Theory - Thomas M. Cover","Data and Computer Communications - William Stallings"]},
  {id:"MOP",semestre:4,nombre:"Métodos de Optimización",creditos:8,previaturas:["ALL"],programa_analitico:"Programación lineal, método simplex, optimización convexa, descenso del gradiente y técnicas de optimización aplicadas a modelos de datos.",bibliografia_recomendada:["Convex Optimization - Stephen Boyd","Investigación de Operaciones - Hamdy A. Taha"]},
  {id:"MIN",semestre:4,nombre:"Metodología de la Investigación",creditos:4,previaturas:[],programa_analitico:"Diseño de investigación, planteamiento de problemas, elaboración de hipótesis, recolección de datos y escritura científica técnica.",bibliografia_recomendada:["Metodología de la investigación - Roberto Hernández Sampieri","Cómo se hace una tesis - Umberto Eco"]},
  {id:"ING4",semestre:4,nombre:"Inglés IV",creditos:4,previaturas:["ING3"],programa_analitico:"Consolidación de la gramática y el vocabulario técnico, orientado a la comprensión auditiva de conferencias y redacción de informes.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 5
  {id:"AA2",semestre:5,nombre:"Aprendizaje Automático II",creditos:8,previaturas:["AA1"],programa_analitico:"Técnicas avanzadas de machine learning, algoritmos de ensamble, máquinas de vectores de soporte (SVM) y reducción de dimensionalidad.",bibliografia_recomendada:["The Elements of Statistical Learning - Hastie, Tibshirani & Friedman"]},
  {id:"RCO",semestre:5,nombre:"Redes de Computadoras",creditos:8,previaturas:["TITD"],programa_analitico:"Arquitectura de redes, modelo OSI y TCP/IP. Análisis sobre amenazas, protocolos de enrutamiento y prácticas de configuración.",bibliografia_recomendada:["Computer Networks - Andrew S. Tanenbaum","Computer Networking: A Top-Down Approach - James Kurose"]},
  {id:"ERS",semestre:5,nombre:"Ética y Responsabilidad Social en TI",creditos:4,previaturas:[],programa_analitico:"Principios éticos y valores en TI, responsabilidad profesional, privacidad y seguridad digital, sesgos y discriminación en algoritmos e IA, impacto social de las TI (mercado laboral, salud), comunicación digital y desafíos para un futuro responsable.",bibliografia_recomendada:["Materiales seleccionados por el profesor"]},
  {id:"PID",semestre:5,nombre:"Proyecto de Ingeniería de Datos",creditos:8,previaturas:["BDR","BDN"],programa_analitico:"Proyecto integrador de diseño e implementación de una tubería de datos completa, integrando extracción, almacenamiento y puesta en producción.",bibliografia_recomendada:["Designing Data-Intensive Applications - Martin Kleppmann"]},
  {id:"ING5",semestre:5,nombre:"Inglés V",creditos:4,previaturas:["ING4"],programa_analitico:"Nivel intermedio-alto orientado a la argumentación técnica, debate sobre tecnología y lectura crítica de papers académicos.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"OPT1",semestre:5,nombre:"Optativa I",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  // Semestre 6
  {id:"AAA",semestre:6,nombre:"Aplicaciones del Aprendizaje Automático",creditos:8,previaturas:["AA2"],programa_analitico:"Implementación de modelos en producción. Procesamiento de lenguaje natural (NLP), visión por computadora y sistemas de recomendación.",bibliografia_recomendada:["Machine Learning Engineering - Andriy Burkov","Deep Learning for Vision Systems - Mohamed Elgendy"]},
  {id:"CSE",semestre:6,nombre:"Ciberseguridad",creditos:8,previaturas:["RCO"],programa_analitico:"Fundamentos de seguridad informática, amenazas y vulnerabilidades. Criptografía simétrica y asimétrica, seguridad en redes (SSL, TLS, VPN), gestión de identidades y accesos, seguridad en aplicaciones, análisis forense digital y hacking ético.",bibliografia_recomendada:["Computer Security: Principles and Practice - William Stallings, Lawrie Brown","Network Security: Private Communication in a Public World - Charlie Kaufman, Radia Perlman, Mike Speciner","Hacking: The Art of Exploitation - Jon Erickson"]},
  {id:"LNPD",semestre:6,nombre:"Leyes y normativas de Protección de Datos",creditos:4,previaturas:[],programa_analitico:"Conceptos y marcos legales de protección de datos a nivel mundial y nacional. Obligaciones de responsables y encargados, mecanismos de cumplimiento, sanciones, auditoría y marco legal para la transferencia internacional de datos.",bibliografia_recomendada:["Compendio de leyes y normativas de protección de datos seleccionadas por el Profesor"]},
  {id:"PAA",semestre:6,nombre:"Proyecto de Aprendizaje Automático",creditos:8,previaturas:["PID"],programa_analitico:"Proyecto integrador en el desarrollo de técnicas avanzadas en minería de datos, coincidencia de patrones y visualización.",bibliografia_recomendada:["Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow - Aurélien Géron"]},
  {id:"ING6",semestre:6,nombre:"Inglés VI",creditos:4,previaturas:["ING5"],programa_analitico:"Preparación para la certificación de nivel B2. Énfasis en la defensa oral de proyectos y fluidez en entornos laborales internacionales.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"OPT2",semestre:6,nombre:"Optativa II",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  // Semestre 7
  {id:"APR",semestre:7,nombre:"Aprendizaje Profundo",creditos:8,previaturas:["AAA","PAA"],programa_analitico:"Introducción al aprendizaje profundo y redes neuronales. Arquitecturas supervisadas y no supervisadas, redes recurrentes (RNN), procesamiento de secuencias y aplicaciones en visión por computadora, reconocimiento de voz y detección de anomalías utilizando frameworks especializados.",bibliografia_recomendada:["Deep Learning - Ian Goodfellow, Yoshua Bengio, Aaron Courville","Deep Learning with Python - Francois Chollet","Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow - Aurélien Géron"]},
  {id:"IBD",semestre:7,nombre:"Infraestructura de Big Data",creditos:8,previaturas:["BDN","PID"],programa_analitico:"Conceptos de Big Data (3Vs). Almacenamiento y procesamiento distribuido (Hadoop, Spark, NoSQL), arquitecturas Lambda y Kappa, escalabilidad, rendimiento, administración, monitoreo e integración de herramientas tecnológicas para grandes volúmenes de datos.",bibliografia_recomendada:["Hadoop: The Definitive Guide - Tom White","Spark: The Definitive Guide: Big Data Processing Made Simple - Bill Chambers, Matei Zaharia"]},
  {id:"AOGP",semestre:7,nombre:"Administración de Org. y Gestión de Proyectos",creditos:4,previaturas:[],programa_analitico:"Principios fundamentales de la administración en el contexto tecnológico. Procesos de planificación estratégica, gestión ágil e indicadores de rendimiento.",bibliografia_recomendada:["A Guide to the Project Management Body of Knowledge (PMBOK Guide) - PMI","Scrum: The Art of Doing Twice the Work in Half the Time - Jeff Sutherland"]},
  {id:"ING7",semestre:7,nombre:"Inglés VII",creditos:4,previaturas:["ING6"],programa_analitico:"Nivel avanzado (C1) enfocado en la redacción de papers, preparación de la tesis y presentaciones profesionales en la industria IT.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"OPT3",semestre:7,nombre:"Optativa III",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  {id:"OPT4",semestre:7,nombre:"Optativa IV",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  // Semestre 8
  {id:"OPT5",semestre:8,nombre:"Optativa V",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la especialización tecnológica o desarrollo de habilidades transversales avanzadas.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  {id:"OPT6",semestre:8,nombre:"Optativa VI",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la especialización tecnológica o desarrollo de habilidades transversales avanzadas.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  {id:"ING8",semestre:8,nombre:"Inglés VIII",creditos:4,previaturas:["ING7"],programa_analitico:"Nivel avanzado superior. Preparación integral para la inserción laboral global, entrevistas técnicas en inglés y liderazgo de proyectos internacionales.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"TFC",semestre:8,nombre:"Trabajo Final de Carrera",creditos:25,previaturas:["PID","PAA"],programa_analitico:"Culminación de conocimientos y habilidades. Aplicación integral de fundamentos de matemática, estadística, minería de datos y modelos predictivos para generar valor.",bibliografia_recomendada:["Metodología de la Investigación - Roberto Hernández Sampieri","Cómo se hace una tesis - Umberto Eco"]}
];

const OPTATIVAS = [
  {id:"PACD",semestre:"Opt",nombre:"Programación Avanzada para Ciencia de Datos",creditos:8,previaturas:["AA2"],programa_analitico:"Profundización en técnicas avanzadas de programación orientadas a la optimización y escalabilidad en ciencia de datos.",bibliografia_recomendada:["Bibliografía provista por el equipo docente de UTEC"]},
  {id:"ISO",semestre:"Opt",nombre:"Ingeniería de Software",creditos:8,previaturas:["BDR"],programa_analitico:"Metodologías ágiles, ciclo de vida del software, arquitectura de sistemas y aseguramiento de la calidad.",bibliografia_recomendada:["Software Engineering - Ian Sommerville"]},
  {id:"ICM",semestre:"Opt",nombre:"Introducción a la Criptografía Moderna",creditos:8,previaturas:[],programa_analitico:"Amenaza cuántica, impacto sobre criptografía simétrica y hashes. Familias de criptografía post-cuántica y gestión de vulnerabilidades.",bibliografia_recomendada:["Introduction to Modern Cryptography - Jonathan Katz, Yehuda Lindell"]},
  {id:"AEPP",semestre:"Opt",nombre:"Datos y Evidencia para Políticas Públicas",creditos:8,previaturas:[],programa_analitico:"Ciclo de políticas públicas con el uso crítico de datos y evidencia. Teoría del cambio (TOC) y diseño de evaluaciones.",bibliografia_recomendada:["Material provisto por el equipo docente de UTEC"]},
  {id:"PIS",semestre:"Opt",nombre:"Procesamiento de Imágenes y Señales",creditos:8,previaturas:["TITD"],programa_analitico:"Técnicas de filtrado, transformación y análisis de señales y algoritmos de procesamiento de imágenes digitales.",bibliografia_recomendada:["Digital Image Processing - Rafael C. Gonzalez, Richard E. Woods"]},
  {id:"SEM",semestre:"Opt",nombre:"Sistemas Embebidos",creditos:8,previaturas:["ARC"],programa_analitico:"Diseño e implementación de sistemas informáticos integrados en hardware específico, microcontroladores e interfaces de sensores.",bibliografia_recomendada:["Material provisto por el equipo docente de UTEC"]},
  {id:"RES",semestre:"Opt",nombre:"Redes de Sensores",creditos:8,previaturas:["RCO"],programa_analitico:"Arquitectura de redes inalámbricas de sensores, protocolos de comunicación IoT y recolección de datos en tiempo real.",bibliografia_recomendada:["Wireless Sensor Networks - Ian F. Akyildiz"]},
  {id:"PDTR",semestre:"Opt",nombre:"Procesamiento de Datos en Tiempo Real",creditos:8,previaturas:["BDN"],programa_analitico:"Arquitecturas de streaming (ej. Apache Kafka), procesamiento continuo de datos y toma de decisiones automatizada.",bibliografia_recomendada:["Streaming Systems - Tyler Akidau"]},
  {id:"CNU",semestre:"Opt",nombre:"Computación en la Nube",creditos:8,previaturas:["RCO"],programa_analitico:"Modelos de servicio (IaaS, PaaS, SaaS), despliegue de infraestructura, contenedores (Docker, Kubernetes) y escalabilidad.",bibliografia_recomendada:["Cloud Computing: Concepts, Technology & Architecture - Thomas Erl"]},
  {id:"VDM",semestre:"Opt",nombre:"Visualización de Datos Masivos",creditos:8,previaturas:["BDN"],programa_analitico:"Técnicas avanzadas y herramientas para la representación interactiva y visual de grandes volúmenes de datos complejos.",bibliografia_recomendada:["The Visual Display of Quantitative Information - Edward R. Tufte"]},
  {id:"PLN",semestre:"Opt",nombre:"Procesamiento de Lenguaje Natural",creditos:8,previaturas:["APR"],programa_analitico:"Modelos y algoritmos para el análisis, comprensión y generación de lenguaje humano mediante técnicas de IA y aprendizaje profundo.",bibliografia_recomendada:["Materiales seleccionados por el profesor"]},
  {id:"VCO",semestre:"5-8",nombre:"Visión Computacional",creditos:8,previaturas:["PIS"],programa_analitico:"Análisis automático de imágenes y videos: detección de objetos, reconocimiento de patrones y segmentación mediante aprendizaje automático.",bibliografia_recomendada:["Materiales seleccionados por el profesor"]},
  {id:"ROB",semestre:"Opt",nombre:"Introducción a la Robótica",creditos:8,previaturas:["AA2","PIS"],programa_analitico:"Cinemática, control de sistemas robóticos y aplicación de algoritmos de inteligencia artificial y percepción en robótica.",bibliografia_recomendada:["Robotics, Vision and Control - Peter Corke"]},
  {id:"ARS",semestre:"Opt",nombre:"Análisis de Redes Sociales",creditos:8,previaturas:["AA2"],programa_analitico:"Teoría de grafos aplicada al análisis de relaciones, detección de comunidades e influencia en redes sociales masivas.",bibliografia_recomendada:["Networks, Crowds, and Markets - David Easley, Jon Kleinberg"]}
];

const SEMESTRES = [1,2,3,4,5,6,7,8];

// ─── THEMES ───────────────────────────────────────────────────────────────────
// Base helper to quickly construct UI palettes.
function buildTheme(label, { pageBg, headerBg, headerBorder, semHdrBg, semNum, semLabel, semCr, hintText, hintPrev, hintHab, cNBg, cNBorder, cNBar, cNName, cNId, cNBadgeBg, cDBg, cDName, cSBg, cSBorder, cSName, cPBg, cPBorder, cPName, cPId, cPBadgeBg, cHBg, cHBorder, cHName, cHId, cHBadgeBg, infoBg, infoColor, mBg, mTitle, mText, mDivider, mBadgePrevBg, mBadgePrevText, mBadgeHabBg, mBadgeHabText, toggleBg, toggleColor }) {
  return {
    label, pageBg, headerBg, headerBorder, semHdrBg, semHdrBorder: headerBorder, semNum, semLabel, semCr, hintText, hintPrev, hintHab,
    cNBg, cNBorder, cNBar, cNName, cNId, cNBadgeBg,
    cDBg: cDBg || pageBg, cDBorder: cNBorder, cDName: cDName || hintText,
    cSBg, cSBorder, cSBar: cSBorder, cSName, cSId: cSName, cSBadgeBg: cNBadgeBg,
    cPBg, cPBorder, cPBar: cPBorder, cPName, cPId, cPBadgeBg,
    cHBg, cHBorder, cHBar: cHBorder, cHName, cHId, cHBadgeBg,
    infoBg, infoColor, infoHover: cSBg,
    mBg, mBorder: headerBorder, mTitle, mText, mDivider, mLabel: semLabel, mFootBg: pageBg,
    mBadgePrevBg, mBadgePrevBorder: cPBorder, mBadgePrevText,
    mBadgeHabBg, mBadgeHabBorder: cHBorder, mBadgeHabText,
    closeBg: infoBg, closeColor: infoColor,
    sBarPrev: hintPrev, sBarHab: hintHab, sBarBiblio: cNBar,
    sLabelPrev: cPName, sLabelHab: cHName, sLabelBiblio: cNId,
    bullet: cNBar, toggleBg, toggleColor, logoColor: cNId,
    legDotSel: cSBorder, legDotPrev: hintPrev, legDotHab: hintHab, legText: semLabel, clearColor: hintText
  };
}

const THEMES = {
  dark: buildTheme("Dark", { pageBg:"#111", headerBg:"rgba(17,17,17,0.93)", headerBorder:"rgba(255,255,255,0.09)", semHdrBg:"#1e1e1e", semNum:"#d8d8d8", semLabel:"rgba(255,255,255,0.38)", semCr:"rgba(255,255,255,0.28)", hintText:"rgba(255,255,255,0.32)", hintPrev:"#d97706", hintHab:"#16a34a", cNBg:"#1c1c1c", cNBorder:"rgba(255,255,255,0.1)", cNBar:"#333", cNName:"#e0e0e0", cNId:"rgba(255,255,255,0.4)", cNBadgeBg:"#282828", cDBg:"#161616", cDName:"rgba(255,255,255,0.18)", cSBg:"#222", cSBorder:"#e0e0e0", cSName:"#f5f5f5", cPBg:"#1f1800", cPBorder:"#b45309", cPName:"#fde68a", cPId:"#fbbf24", cPBadgeBg:"#2a1c00", cHBg:"#0d1f12", cHBorder:"#15803d", cHName:"#bbf7d0", cHId:"#4ade80", cHBadgeBg:"#0a1a0e", infoBg:"#252525", infoColor:"rgba(255,255,255,0.5)", mBg:"#181818", mTitle:"#f0f0f0", mText:"rgba(255,255,255,0.72)", mDivider:"rgba(255,255,255,0.08)", mBadgePrevBg:"#2a1800", mBadgePrevText:"#fcd34d", mBadgeHabBg:"#081a10", mBadgeHabText:"#6ee7b7", toggleBg:"#232323", toggleColor:"#f0c060" }),
  
  light2026: buildTheme("Light 2026", { pageBg:"#f0ede8", headerBg:"rgba(240,237,232,0.93)", headerBorder:"rgba(0,0,0,0.09)", semHdrBg:"#e6e2dc", semNum:"#1a1a1a", semLabel:"rgba(0,0,0,0.4)", semCr:"rgba(0,0,0,0.3)", hintText:"rgba(0,0,0,0.38)", hintPrev:"#b45309", hintHab:"#15803d", cNBg:"#faf8f5", cNBorder:"rgba(0,0,0,0.1)", cNBar:"#d6d0c8", cNName:"#1a1a1a", cNId:"#666", cNBadgeBg:"#ede9e3", cDBg:"#f0ede8", cDName:"rgba(0,0,0,0.22)", cSBg:"#faf8f5", cSBorder:"#1a1a1a", cSName:"#111", cPBg:"#fffbf0", cPBorder:"#d97706", cPName:"#78350f", cPId:"#92400e", cPBadgeBg:"#fef3c7", cHBg:"#f0fdf4", cHBorder:"#16a34a", cHName:"#14532d", cHId:"#166534", cHBadgeBg:"#dcfce7", infoBg:"#e8e4de", infoColor:"#555", mBg:"#faf8f5", mTitle:"#111", mText:"#374151", mDivider:"rgba(0,0,0,0.07)", mBadgePrevBg:"#fef3c7", mBadgePrevText:"#92400e", mBadgeHabBg:"#dcfce7", mBadgeHabText:"#14532d", toggleBg:"#e0dcd6", toggleColor:"#374151" }),
  
  softLight: buildTheme("Soft Light (Eye Care)", { pageBg:"#fbf8f1", headerBg:"rgba(251,248,241,0.95)", headerBorder:"rgba(0,0,0,0.08)", semHdrBg:"#f2ede4", semNum:"#4a443a", semLabel:"rgba(74,68,58,0.5)", semCr:"rgba(74,68,58,0.4)", hintText:"rgba(74,68,58,0.45)", hintPrev:"#c27027", hintHab:"#438543", cNBg:"#ffffff", cNBorder:"rgba(0,0,0,0.08)", cNBar:"#d8d3c9", cNName:"#4a443a", cNId:"#7d7568", cNBadgeBg:"#f2ede4", cDBg:"#fbf8f1", cDName:"rgba(74,68,58,0.3)", cSBg:"#ffffff", cSBorder:"#5a87b8", cSName:"#2a4b6e", cPBg:"#fdf6eb", cPBorder:"#d28b4b", cPName:"#9e530b", cPId:"#c27027", cPBadgeBg:"#f6e8d2", cHBg:"#f0fae8", cHBorder:"#679967", cHName:"#2e5c2e", cHId:"#438543", cHBadgeBg:"#def0d5", infoBg:"#f2ede4", infoColor:"#665e52", mBg:"#ffffff", mTitle:"#36312a", mText:"#5e574d", mDivider:"rgba(0,0,0,0.08)", mBadgePrevBg:"#f6e8d2", mBadgePrevText:"#9e530b", mBadgeHabBg:"#def0d5", mBadgeHabText:"#2e5c2e", toggleBg:"#e5decb", toggleColor:"#4a443a" }),

  nord: buildTheme("Nord", { pageBg:"#2e3440", headerBg:"rgba(46,52,64,0.95)", headerBorder:"#3b4252", semHdrBg:"#3b4252", semNum:"#eceff4", semLabel:"#d8dee9", semCr:"#d8dee9", hintText:"#4c566a", hintPrev:"#ebcb8b", hintHab:"#a3be8c", cNBg:"#434c5e", cNBorder:"#4c566a", cNBar:"#4c566a", cNName:"#eceff4", cNId:"#d8dee9", cNBadgeBg:"#3b4252", cDBg:"#2e3440", cDName:"#4c566a", cSBg:"#4c566a", cSBorder:"#88c0d0", cSName:"#8fbcbb", cPBg:"#3b4252", cPBorder:"#ebcb8b", cPName:"#ebcb8b", cPId:"#ebcb8b", cPBadgeBg:"#2e3440", cHBg:"#3b4252", cHBorder:"#a3be8c", cHName:"#a3be8c", cHId:"#a3be8c", cHBadgeBg:"#2e3440", infoBg:"#3b4252", infoColor:"#d8dee9", mBg:"#434c5e", mTitle:"#eceff4", mText:"#e5e9f0", mDivider:"#4c566a", mBadgePrevBg:"#3b4252", mBadgePrevText:"#ebcb8b", mBadgeHabBg:"#3b4252", mBadgeHabText:"#a3be8c", toggleBg:"#3b4252", toggleColor:"#88c0d0" }),

  dracula: buildTheme("Dracula Official", { pageBg:"#282a36", headerBg:"rgba(40,42,54,0.95)", headerBorder:"#44475a", semHdrBg:"#44475a", semNum:"#f8f8f2", semLabel:"#6272a4", semCr:"#6272a4", hintText:"#6272a4", hintPrev:"#f1fa8c", hintHab:"#50fa7b", cNBg:"#44475a", cNBorder:"#6272a4", cNBar:"#6272a4", cNName:"#f8f8f2", cNId:"#8be9fd", cNBadgeBg:"#282a36", cDBg:"#282a36", cDName:"#6272a4", cSBg:"#6272a4", cSBorder:"#bd93f9", cSName:"#bd93f9", cPBg:"#44475a", cPBorder:"#f1fa8c", cPName:"#f1fa8c", cPId:"#f1fa8c", cPBadgeBg:"#282a36", cHBg:"#44475a", cHBorder:"#50fa7b", cHName:"#50fa7b", cHId:"#50fa7b", cHBadgeBg:"#282a36", infoBg:"#282a36", infoColor:"#f8f8f2", mBg:"#44475a", mTitle:"#f8f8f2", mText:"#f8f8f2", mDivider:"#6272a4", mBadgePrevBg:"#282a36", mBadgePrevText:"#f1fa8c", mBadgeHabBg:"#282a36", mBadgeHabText:"#50fa7b", toggleBg:"#6272a4", toggleColor:"#ff79c6" }),

  materialDark: buildTheme("Material Dark", { pageBg:"#212121", headerBg:"rgba(33,33,33,0.95)", headerBorder:"#424242", semHdrBg:"#303030", semNum:"#eeffff", semLabel:"rgba(238,255,255,0.5)", semCr:"rgba(238,255,255,0.4)", hintText:"rgba(238,255,255,0.3)", hintPrev:"#ffcb6b", hintHab:"#c3e88d", cNBg:"#303030", cNBorder:"#424242", cNBar:"#545454", cNName:"#eeffff", cNId:"rgba(238,255,255,0.6)", cNBadgeBg:"#212121", cDBg:"#212121", cDName:"rgba(238,255,255,0.2)", cSBg:"#424242", cSBorder:"#82aaff", cSName:"#82aaff", cPBg:"#303030", cPBorder:"#ffcb6b", cPName:"#ffcb6b", cPId:"#ffcb6b", cPBadgeBg:"#212121", cHBg:"#303030", cHBorder:"#c3e88d", cHName:"#c3e88d", cHId:"#c3e88d", cHBadgeBg:"#212121", infoBg:"#212121", infoColor:"#eeffff", mBg:"#303030", mTitle:"#eeffff", mText:"rgba(238,255,255,0.8)", mDivider:"#424242", mBadgePrevBg:"#212121", mBadgePrevText:"#ffcb6b", mBadgeHabBg:"#212121", mBadgeHabText:"#c3e88d", toggleBg:"#424242", toggleColor:"#c792ea" }),

  materialOcean: buildTheme("Material Ocean", { pageBg:"#0f111a", headerBg:"rgba(15,17,26,0.95)", headerBorder:"#1a1c29", semHdrBg:"#1a1c29", semNum:"#a6accd", semLabel:"rgba(166,172,205,0.5)", semCr:"rgba(166,172,205,0.4)", hintText:"rgba(166,172,205,0.3)", hintPrev:"#ffcb6b", hintHab:"#c3e88d", cNBg:"#1a1c29", cNBorder:"#292d3e", cNBar:"#292d3e", cNName:"#a6accd", cNId:"rgba(166,172,205,0.6)", cNBadgeBg:"#0f111a", cDBg:"#0f111a", cDName:"rgba(166,172,205,0.2)", cSBg:"#292d3e", cSBorder:"#82aaff", cSName:"#82aaff", cPBg:"#1a1c29", cPBorder:"#ffcb6b", cPName:"#ffcb6b", cPId:"#ffcb6b", cPBadgeBg:"#0f111a", cHBg:"#1a1c29", cHBorder:"#c3e88d", cHName:"#c3e88d", cHId:"#c3e88d", cHBadgeBg:"#0f111a", infoBg:"#0f111a", infoColor:"#a6accd", mBg:"#1a1c29", mTitle:"#a6accd", mText:"rgba(166,172,205,0.8)", mDivider:"#292d3e", mBadgePrevBg:"#0f111a", mBadgePrevText:"#ffcb6b", mBadgeHabBg:"#0f111a", mBadgeHabText:"#c3e88d", toggleBg:"#292d3e", toggleColor:"#82aaff" }),

  materialPalenight: buildTheme("Material Palenight", { pageBg:"#292d3e", headerBg:"rgba(41,45,62,0.95)", headerBorder:"#32374d", semHdrBg:"#32374d", semNum:"#a6accd", semLabel:"rgba(166,172,205,0.5)", semCr:"rgba(166,172,205,0.4)", hintText:"rgba(166,172,205,0.3)", hintPrev:"#ffcb6b", hintHab:"#c3e88d", cNBg:"#32374d", cNBorder:"#444a73", cNBar:"#444a73", cNName:"#a6accd", cNId:"rgba(166,172,205,0.6)", cNBadgeBg:"#292d3e", cDBg:"#292d3e", cDName:"rgba(166,172,205,0.2)", cSBg:"#444a73", cSBorder:"#82aaff", cSName:"#82aaff", cPBg:"#32374d", cPBorder:"#ffcb6b", cPName:"#ffcb6b", cPId:"#ffcb6b", cPBadgeBg:"#292d3e", cHBg:"#32374d", cHBorder:"#c3e88d", cHName:"#c3e88d", cHId:"#c3e88d", cHBadgeBg:"#292d3e", infoBg:"#292d3e", infoColor:"#a6accd", mBg:"#32374d", mTitle:"#a6accd", mText:"rgba(166,172,205,0.8)", mDivider:"#444a73", mBadgePrevBg:"#292d3e", mBadgePrevText:"#ffcb6b", mBadgeHabBg:"#292d3e", mBadgeHabText:"#c3e88d", toggleBg:"#444a73", toggleColor:"#c792ea" }),

  oneDarkPro: buildTheme("One Dark Pro", { pageBg:"#282c34", headerBg:"rgba(40,44,52,0.95)", headerBorder:"#353b45", semHdrBg:"#353b45", semNum:"#abb2bf", semLabel:"rgba(171,178,191,0.5)", semCr:"rgba(171,178,191,0.4)", hintText:"rgba(171,178,191,0.3)", hintPrev:"#e5c07b", hintHab:"#98c379", cNBg:"#353b45", cNBorder:"#3e4451", cNBar:"#3e4451", cNName:"#abb2bf", cNId:"rgba(171,178,191,0.6)", cNBadgeBg:"#282c34", cDBg:"#282c34", cDName:"rgba(171,178,191,0.2)", cSBg:"#3e4451", cSBorder:"#61afef", cSName:"#61afef", cPBg:"#353b45", cPBorder:"#e5c07b", cPName:"#e5c07b", cPId:"#e5c07b", cPBadgeBg:"#282c34", cHBg:"#353b45", cHBorder:"#98c379", cHName:"#98c379", cHId:"#98c379", cHBadgeBg:"#282c34", infoBg:"#282c34", infoColor:"#abb2bf", mBg:"#353b45", mTitle:"#abb2bf", mText:"rgba(171,178,191,0.8)", mDivider:"#3e4451", mBadgePrevBg:"#282c34", mBadgePrevText:"#e5c07b", mBadgeHabBg:"#282c34", mBadgeHabText:"#98c379", toggleBg:"#3e4451", toggleColor:"#61afef" }),

  horizonDark: buildTheme("Horizon Dark", { pageBg:"#1c1e26", headerBg:"rgba(28,30,38,0.95)", headerBorder:"#232530", semHdrBg:"#232530", semNum:"#d5d8da", semLabel:"rgba(213,216,218,0.5)", semCr:"rgba(213,216,218,0.4)", hintText:"rgba(213,216,218,0.3)", hintPrev:"#fac863", hintHab:"#09f7a0", cNBg:"#232530", cNBorder:"#2e303e", cNBar:"#2e303e", cNName:"#d5d8da", cNId:"rgba(213,216,218,0.6)", cNBadgeBg:"#1c1e26", cDBg:"#1c1e26", cDName:"rgba(213,216,218,0.2)", cSBg:"#2e303e", cSBorder:"#e95678", cSName:"#e95678", cPBg:"#232530", cPBorder:"#fac863", cPName:"#fac863", cPId:"#fac863", cPBadgeBg:"#1c1e26", cHBg:"#232530", cHBorder:"#09f7a0", cHName:"#09f7a0", cHId:"#09f7a0", cHBadgeBg:"#1c1e26", infoBg:"#1c1e26", infoColor:"#d5d8da", mBg:"#232530", mTitle:"#d5d8da", mText:"rgba(213,216,218,0.8)", mDivider:"#2e303e", mBadgePrevBg:"#1c1e26", mBadgePrevText:"#fac863", mBadgeHabBg:"#1c1e26", mBadgeHabText:"#09f7a0", toggleBg:"#2e303e", toggleColor:"#e95678" }),

  horizonBright: buildTheme("Horizon Bright", { pageBg:"#fdf0ed", headerBg:"rgba(253,240,237,0.95)", headerBorder:"#fadad1", semHdrBg:"#fadad1", semNum:"#1c1e26", semLabel:"rgba(28,30,38,0.5)", semCr:"rgba(28,30,38,0.4)", hintText:"rgba(28,30,38,0.3)", hintPrev:"#f09383", hintHab:"#09f7a0", cNBg:"#ffffff", cNBorder:"#fadad1", cNBar:"#f09383", cNName:"#1c1e26", cNId:"rgba(28,30,38,0.6)", cNBadgeBg:"#fdf0ed", cDBg:"#fdf0ed", cDName:"rgba(28,30,38,0.2)", cSBg:"#ffffff", cSBorder:"#e95678", cSName:"#e95678", cPBg:"#ffffff", cPBorder:"#f09383", cPName:"#f09383", cPId:"#f09383", cPBadgeBg:"#fdf0ed", cHBg:"#ffffff", cHBorder:"#09f7a0", cHName:"#1c1e26", cHId:"#09f7a0", cHBadgeBg:"#fdf0ed", infoBg:"#fdf0ed", infoColor:"#1c1e26", mBg:"#ffffff", mTitle:"#1c1e26", mText:"rgba(28,30,38,0.8)", mDivider:"#fadad1", mBadgePrevBg:"#fdf0ed", mBadgePrevText:"#f09383", mBadgeHabBg:"#fdf0ed", mBadgeHabText:"#09f7a0", toggleBg:"#fadad1", toggleColor:"#e95678" })
};

// Also keep existing default fallbacks to ensure nothing breaks
const fallbackThemes = {
  monokaiDimmed: buildTheme("Monokai Dimmed", { pageBg:"#1e1e1e", headerBg:"rgba(30,30,30,0.93)", headerBorder:"rgba(255,255,255,0.07)", semHdrBg:"#272727", semNum:"#c8c8c8", semLabel:"rgba(200,200,200,0.4)", semCr:"rgba(200,200,200,0.3)", hintText:"rgba(200,200,200,0.35)", hintPrev:"#e5c07b", hintHab:"#98c379", cNBg:"#252525", cNBorder:"rgba(255,255,255,0.09)", cNBar:"#383838", cNName:"#c8c8c8", cNId:"rgba(200,200,200,0.42)", cNBadgeBg:"#2e2e2e", cDBg:"#1e1e1e", cDName:"rgba(200,200,200,0.18)", cSBg:"#2d2d2d", cSBorder:"#c8c8c8", cSName:"#f0f0f0", cPBg:"#2a2000", cPBorder:"#e5c07b", cPName:"#ffe5a0", cPId:"#e5c07b", cPBadgeBg:"#332800", cHBg:"#1a2a1a", cHBorder:"#98c379", cHName:"#c3f0a0", cHId:"#98c379", cHBadgeBg:"#1e301e", infoBg:"#2e2e2e", infoColor:"rgba(200,200,200,0.5)", mBg:"#222222", mTitle:"#e8e8e8", mText:"rgba(200,200,200,0.78)", mDivider:"rgba(255,255,255,0.07)", mBadgePrevBg:"#332800", mBadgePrevText:"#ffe5a0", mBadgeHabBg:"#1a2a1a", mBadgeHabText:"#c3f0a0", toggleBg:"#2e2e2e", toggleColor:"#e5c07b" }),
  monokai: buildTheme("Monokai", { pageBg:"#272822", headerBg:"rgba(39,40,34,0.94)", headerBorder:"rgba(255,255,255,0.08)", semHdrBg:"#3e3d32", semNum:"#f8f8f2", semLabel:"rgba(248,248,242,0.42)", semCr:"rgba(248,248,242,0.32)", hintText:"rgba(248,248,242,0.36)", hintPrev:"#e6db74", hintHab:"#a6e22e", cNBg:"#3e3d32", cNBorder:"rgba(255,255,255,0.1)", cNBar:"#5c5b50", cNName:"#f8f8f2", cNId:"rgba(248,248,242,0.45)", cNBadgeBg:"#49483e", cDBg:"#2e2d27", cDName:"rgba(248,248,242,0.2)", cSBg:"#49483e", cSBorder:"#f8f8f2", cSName:"#ffffff", cPBg:"#3a3300", cPBorder:"#e6db74", cPName:"#fff5a0", cPId:"#e6db74", cPBadgeBg:"#443e00", cHBg:"#1e2e10", cHBorder:"#a6e22e", cHName:"#d8f5a0", cHId:"#a6e22e", cHBadgeBg:"#243615", infoBg:"#49483e", infoColor:"rgba(248,248,242,0.55)", mBg:"#3e3d32", mTitle:"#f8f8f2", mText:"rgba(248,248,242,0.8)", mDivider:"rgba(255,255,255,0.08)", mBadgePrevBg:"#443e00", mBadgePrevText:"#fff5a0", mBadgeHabBg:"#1e2e10", mBadgeHabText:"#d8f5a0", toggleBg:"#49483e", toggleColor:"#e6db74" }),
  solarizedLight: buildTheme("Solarized Light", { pageBg:"#fdf6e3", headerBg:"rgba(253,246,227,0.93)", headerBorder:"rgba(147,161,161,0.22)", semHdrBg:"#eee8d5", semNum:"#073642", semLabel:"rgba(7,54,66,0.45)", semCr:"rgba(7,54,66,0.35)", hintText:"rgba(7,54,66,0.4)", hintPrev:"#b58900", hintHab:"#2aa198", cNBg:"#fdf6e3", cNBorder:"rgba(147,161,161,0.28)", cNBar:"#93a1a1", cNName:"#073642", cNId:"#657b83", cNBadgeBg:"#eee8d5", cDBg:"#fdf6e3", cDName:"rgba(7,54,66,0.22)", cSBg:"#eee8d5", cSBorder:"#073642", cSName:"#002b36", cPBg:"#fffbef", cPBorder:"#b58900", cPName:"#7b5e00", cPId:"#b58900", cPBadgeBg:"#f5ecc8", cHBg:"#eefcfa", cHBorder:"#2aa198", cHName:"#005f5a", cHId:"#2aa198", cHBadgeBg:"#d4f4f2", infoBg:"#eee8d5", infoColor:"#657b83", mBg:"#fdf6e3", mTitle:"#002b36", mText:"#354a50", mDivider:"rgba(147,161,161,0.18)", mBadgePrevBg:"#f5ecc8", mBadgePrevText:"#7b5e00", mBadgeHabBg:"#d4f4f2", mBadgeHabText:"#005f5a", toggleBg:"#eee8d5", toggleColor:"#073642" })
};

Object.assign(THEMES, fallbackThemes);

const THEME_ORDER = ["dark", "light2026", "softLight", "nord", "dracula", "materialDark", "materialOcean", "materialPalenight", "oneDarkPro", "horizonDark", "horizonBright", "monokaiDimmed", "monokai", "solarizedLight"];


// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ materia, effectiveMaterias, onClose, t, onSelectOptativa, onRemoveOptativa }) {
  const [selecting, setSelecting] = useState(false);

  // Automatically switch to selecting mode if it's an unconfigured slot
  useEffect(() => {
    if (materia?.isUnconfiguredOptativa) setSelecting(true);
    else setSelecting(false);
  }, [materia]);

  if (!materia) return null;

  const prevObjs = (materia.previaturas || []).map(pid => effectiveMaterias.find(m => m.id === pid)).filter(Boolean);
  const habilitadas = effectiveMaterias.filter(m => m.previaturas && m.previaturas.includes(materia.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ border:`1px solid ${t.mBorder}`, backgroundColor:t.mBg, maxHeight:"90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom:`1px solid ${t.mDivider}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor:t.cNBadgeBg, color:t.mLabel }}>
                  Semestre {materia.semestre === "Opt" ? (materia.slotSemestre || "?") : materia.semestre}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor:t.cNBadgeBg, color:t.mLabel }}>
                  {materia.id}
                </span>
              </div>
              <h2 className="text-base font-bold leading-snug" style={{ color:t.mTitle }}>
                {selecting ? `Elegir Optativa para ${materia.originalName || materia.nombre}` : materia.nombre}
              </h2>
            </div>
            <button onClick={onClose} className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg transition" style={{ backgroundColor:t.closeBg, color:t.closeColor }}>×</button>
          </div>
          
          {!selecting && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor:t.cNBadgeBg, color:t.mLabel, border:`1px solid ${t.mBorder}` }}>
                {materia.creditos} créditos
              </span>
              {prevObjs.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor:t.mBadgePrevBg, color:t.mBadgePrevText, border:`1px solid ${t.mBadgePrevBorder}` }}>
                  ↑ {prevObjs.length} previa{prevObjs.length > 1 ? "s" : ""}
                </span>
              )}
              {habilitadas.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor:t.mBadgeHabBg, color:t.mBadgeHabText, border:`1px solid ${t.mBadgeHabBorder}` }}>
                  ↓ habilita {habilitadas.length}
                </span>
              )}
              {materia.isConfiguredOptativa && (
                 <button onClick={() => setSelecting(true)} className="text-xs font-bold px-2.5 py-1 rounded-full ml-auto transition hover:opacity-80" style={{ backgroundColor:t.toggleBg, color:t.toggleColor }}>
                   Cambiar Optativa
                 </button>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1" style={{ maxHeight:"58vh" }}>
          {selecting ? (
            <div className="space-y-3">
              <p className="text-xs" style={{ color:t.mText }}>Selecciona la unidad curricular optativa que deseas cursar en este espacio:</p>
              {OPTATIVAS.map(opt => (
                <div key={opt.id} className="p-4 rounded-xl border transition-all" style={{ borderColor: t.mDivider, backgroundColor: t.cDBg }}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm" style={{ color: t.mTitle }}>{opt.nombre}</span>
                        <button onClick={() => { onSelectOptativa(materia.slotId, opt.id); setSelecting(false); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-transform hover:scale-105"
                          style={{ backgroundColor: t.mBadgeHabBg, color: t.mBadgeHabText, border: `1px solid ${t.mBadgeHabBorder}` }}>
                          Elegir
                        </button>
                    </div>
                    <div className="text-xs mb-2 font-mono" style={{ color: t.mLabel }}>{opt.id} · {opt.creditos}cr</div>
                    <div className="text-xs flex flex-wrap gap-1 items-center mb-2">
                        <span style={{ color: t.sLabelPrev }}>Previas:</span>
                        {opt.previaturas.length > 0 ? opt.previaturas.map(p => (
                          <span key={p} className="px-1.5 py-0.5 rounded" style={{ backgroundColor: t.mBadgePrevBg, color: t.mBadgePrevText }}>{p}</span>
                        )) : <span style={{ color: t.hintText }}>Ninguna</span>}
                    </div>
                    <p className="text-xs" style={{ color: t.mText }}>{opt.programa_analitico}</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-0.5 rounded" style={{ backgroundColor:t.sBarBiblio }}></span>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color:t.sLabelBiblio }}>Programa Analítico</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color:t.mText }}>{materia.programa_analitico}</p>
              </div>

              {prevObjs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-0.5 rounded" style={{ backgroundColor:t.sBarPrev }}></span>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color:t.sLabelPrev }}>Previaturas requeridas</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {prevObjs.map(p => (
                      <span key={p.id} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor:t.mBadgePrevBg, color:t.mBadgePrevText, border:`1px solid ${t.mBadgePrevBorder}` }}>
                        {p.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {habilitadas.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-0.5 rounded" style={{ backgroundColor:t.sBarHab }}></span>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color:t.sLabelHab }}>Materias que habilita</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {habilitadas.map(m => (
                      <span key={m.id} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor:t.mBadgeHabBg, color:t.mBadgeHabText, border:`1px solid ${t.mBadgeHabBorder}` }}>
                        {m.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {materia.bibliografia_recomendada && materia.bibliografia_recomendada.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-0.5 rounded" style={{ backgroundColor:t.sBarBiblio }}></span>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color:t.sLabelBiblio }}>Bibliografía Recomendada</span>
                  </div>
                  <ul className="space-y-2">
                    {materia.bibliografia_recomendada.map((b, i) => (
                      <li key={i} className="text-sm flex gap-2.5 items-start">
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor:t.bullet }}></span>
                        <span style={{ color:t.mText }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 shrink-0" style={{ borderTop:`1px solid ${t.mDivider}`, backgroundColor:t.mFootBg }}>
          <button onClick={onClose} className="w-full py-2 rounded-xl text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor:t.closeBg, color:t.closeColor }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ materia, state, t, onCardClick, onInfo }) {
  const dim  = state === "dim";
  const sel  = state === "selected";
  const prev = state === "previa";
  const hab  = state === "habilitada";
  const isUnconf = materia.isUnconfiguredOptativa;

  let bg, border, bar, nameC, idC, badgeBg;
  if (dim)       { bg=t.cDBg; border=t.cDBorder; bar="transparent"; nameC=t.cDName; idC=t.cDName; badgeBg=t.cNBadgeBg; }
  else if (sel)  { bg=t.cSBg; border=t.cSBorder; bar=t.cSBar; nameC=t.cSName; idC=t.cSId; badgeBg=t.cSBadgeBg; }
  else if (prev) { bg=t.cPBg; border=t.cPBorder; bar=t.cPBar; nameC=t.cPName; idC=t.cPId; badgeBg=t.cPBadgeBg; }
  else if (hab)  { bg=t.cHBg; border=t.cHBorder; bar=t.cHBar; nameC=t.cHName; idC=t.cHId; badgeBg=t.cHBadgeBg; }
  else           { bg=t.cNBg; border=t.cNBorder; bar=t.cNBar; nameC=t.cNName; idC=t.cNId; badgeBg=t.cNBadgeBg; }

  // Adjust visualization for an unconfigured optativa
  if (isUnconf && !sel && !dim) {
    bg = "transparent";
    border = t.mDivider;
    bar = "transparent";
    nameC = t.hintText;
  }

  return (
    <div
      onClick={dim ? undefined : onCardClick}
      className="relative rounded-xl overflow-hidden transition-all duration-150 flex flex-col"
      style={{
        backgroundColor: bg,
        border: `1.5px ${isUnconf ? 'dashed' : 'solid'} ${border}`,
        cursor: dim ? "default" : "pointer",
        opacity: dim ? 0.32 : 1,
        boxShadow: sel ? `0 2px 12px rgba(0,0,0,0.18)` : "none",
        minHeight: "130px"
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: bar }} />
      <div className="pl-4 pr-3 pt-3 pb-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black tracking-widest uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: badgeBg, color: idC }}>
            {materia.id}
          </span>
          <span className="text-xs font-bold rounded px-1.5 py-0.5" style={{ backgroundColor: badgeBg, color: idC }}>
            {materia.creditos}cr
          </span>
        </div>
        <p className="text-sm font-semibold leading-snug mb-3 flex-1" style={{ color: nameC }}>
          {isUnconf ? `[${materia.nombre}]` : materia.nombre}
        </p>
        {!dim && (
          <button
            onClick={e => { e.stopPropagation(); onInfo(); }}
            className="w-full text-xs font-semibold py-1.5 rounded-lg transition"
            style={{ backgroundColor: t.infoBg, color: t.infoColor }}
          >
            {isUnconf ? "Elegir Optativa" : "Más información"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── THEME SWITCHER ───────────────────────────────────────────────────────────
function ThemeSwitcher({ current, onChange, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
        style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}
      >
        <span>🎨</span>
        <span className="hidden sm:inline">{THEMES[current]?.label || "Theme"}</span>
        <span className="opacity-60">▾</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[180px]"
          style={{ backgroundColor: t.mBg, border: `1px solid ${t.mBorder}`, maxHeight: '60vh', overflowY: 'auto' }}
        >
          {THEME_ORDER.map(key => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold transition flex items-center gap-2"
              style={{
                color: current === key ? t.hintHab : t.mLabel,
                backgroundColor: current === key ? (t.mBadgeHabBg || "transparent") : "transparent",
              }}
            >
              {current === key && <span>✓</span>}
              {current !== key && <span style={{ width: "1em", display: "inline-block" }}></span>}
              {THEMES[key].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useState("dark");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [modalSlotId, setModalSlotId] = useState(null);
  const [optativasConfig, setOptativasConfig] = useState({});

  const t = THEMES[themeKey] || THEMES.dark;

  // Process MATERIAS taking into account selected OPTATIVAS
  const effectiveMaterias = useMemo(() => {
    return MATERIAS.map(m => {
      if (m.id.startsWith('OPT')) {
        const assignedOptId = optativasConfig[m.id];
        if (assignedOptId) {
          const optData = OPTATIVAS.find(o => o.id === assignedOptId);
          if (optData) {
            return { ...m, ...optData, slotId: m.id, slotSemestre: m.semestre, isConfiguredOptativa: true, originalName: m.nombre };
          }
        }
        return { ...m, slotId: m.id, isUnconfiguredOptativa: true };
      }
      return { ...m, slotId: m.id };
    });
  }, [optativasConfig]);

  const selected = useMemo(() => {
    if (!selectedSlotId) return null;
    return effectiveMaterias.find(m => m.slotId === selectedSlotId);
  }, [selectedSlotId, effectiveMaterias]);

  const activeModalData = useMemo(() => {
    if (!modalSlotId) return null;
    return effectiveMaterias.find(m => m.slotId === modalSlotId);
  }, [modalSlotId, effectiveMaterias]);

  const getState = useCallback((m) => {
    if (!selected) return "neutral";
    if (m.slotId === selected.slotId) return "selected";
    if (selected.previaturas && selected.previaturas.includes(m.id)) return "previa";
    if (m.previaturas && m.previaturas.includes(selected.id)) return "habilitada";
    return "dim";
  }, [selected]);

  const handleCardClick = (m) => {
    setSelectedSlotId(prev => prev === m.slotId ? null : m.slotId);
  };

  const handleSelectOptativa = (slotId, optId) => {
    setOptativasConfig(prev => ({ ...prev, [slotId]: optId }));
  };

  const handleRemoveOptativa = (slotId) => {
    setOptativasConfig(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const totalCreditos = MATERIAS.reduce((a, m) => a + m.creditos, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: t.pageBg, transition: "background-color 0.25s" }}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, backdropFilter: "blur(12px)" }}>
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: t.logoColor }}>UTEC</span>
              <h1 className="text-sm sm:text-base font-bold truncate" style={{ color: t.semNum }}>
                Malla Curricular · LIDIA / TAGD
              </h1>
            </div>
            <p className="text-xs mt-0.5" style={{ color: t.hintText }}>
              {MATERIAS.length} asignaturas · {totalCreditos} créditos totales
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            {[
              { label: "Seleccionada", dot: t.legDotSel },
              { label: "Previa ↑",     dot: t.legDotPrev },
              { label: "Habilitada ↓", dot: t.legDotHab },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.dot }} />
                <span className="text-xs" style={{ color: t.legText }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ThemeSwitcher current={themeKey} onChange={setThemeKey} t={t} />
        </div>
      </header>

      {/* ── Status bar ── */}
      <div className="py-2 px-4 text-center text-xs" style={{ color: t.hintText, borderBottom: `1px solid ${t.headerBorder}` }}>
        {selected ? (
          <span>
            <span style={{ color: t.hintPrev }}>↑ previas</span>{" · "}
            <span style={{ color: t.hintHab }}>↓ materias habilitadas</span>{" · "}
            <button onClick={() => setSelectedSlotId(null)} style={{ color: t.clearColor, textDecoration: "underline" }}>Limpiar selección</button>
          </span>
        ) : "Click en una materia para ver sus dependencias · ℹ para más detalles"}
      </div>

      {/* ── Grid ── */}
      <main className="max-w-[1700px] mx-auto px-3 sm:px-5 py-5">
        <div className="overflow-x-auto pb-6">
          <div className="grid gap-3 min-w-[1000px]" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
            {SEMESTRES.map(s => {
              const mats = effectiveMaterias.filter(m => m.semestre === s || m.slotSemestre === s);
              return (
                <div key={s} className="flex flex-col gap-2.5">
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: t.semHdrBg, border: `1px solid ${t.semHdrBorder}` }}>
                    <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: t.semLabel }}>Sem</div>
                    <div className="text-2xl font-black leading-none" style={{ color: t.semNum }}>{s}</div>
                    <div className="text-xs mt-0.5 font-medium" style={{ color: t.semCr }}>
                      {mats.reduce((a, m) => a + m.creditos, 0)}cr
                    </div>
                  </div>
                  {mats.map(m => (
                    <Card
                      key={m.slotId}
                      materia={m}
                      state={getState(m)}
                      t={t}
                      onCardClick={() => handleCardClick(m)}
                      onInfo={() => setModalSlotId(m.slotId)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Modal 
        materia={activeModalData} 
        effectiveMaterias={effectiveMaterias}
        t={t} 
        onClose={() => setModalSlotId(null)} 
        onSelectOptativa={handleSelectOptativa}
        onRemoveOptativa={handleRemoveOptativa}
      />
    </div>
  );
}