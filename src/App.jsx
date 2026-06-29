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
  {id:"ALL",semestre:2,nombre:"Álgebra Lineal",creditos:8,previaturas:[],programa_analitico:"Sistemas de ecuaciones lineales, matrices, determinantes, espacios vectoriales, transformaciones lineales, valores y vectores propios.",bibliografia_recomendada:["Álgebra lineal y sus aplicaciones - David C. Lay","Álgebra Lineal - Stanley I. Grossman"]},
  {id:"ARC",semestre:2,nombre:"Arquitectura de Computadoras",creditos:8,previaturas:["MDI"],programa_analitico:"Organización y funcionamiento interno de los sistemas de computación, representación de datos a bajo nivel, CPU, memoria y jerarquías.",bibliografia_recomendada:["Organización y arquitectura de computadores - William Stallings","Estructura y diseño de computadores - Patterson & Hennessy"]},
  {id:"ING2",semestre:2,nombre:"Inglés II",creditos:4,previaturas:[],programa_analitico:"Continuación del desarrollo de habilidades comunicativas en inglés, con mayor énfasis en la comprensión auditiva y lectura de documentación técnica.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 3
  {id:"SOP",semestre:3,nombre:"Sistemas Operativos",creditos:8,previaturas:["ARC"],programa_analitico:"Administración de procesos, gestión de memoria (paginación y virtualización), entrada/salida y sistemas de archivos.",bibliografia_recomendada:["Sistemas Operativos: Conceptos Fundamentales - Silberschatz, Galvin & Gagne","Sistemas Operativos Modernos - Andrew S. Tanenbaum"]},
  {id:"BDR",semestre:3,nombre:"Bases de Datos Relacionales",creditos:8,previaturas:["EDA"],programa_analitico:"Modelo Entidad-Relación, álgebra relacional, normalización y lenguaje SQL avanzado para la gestión y consulta de bases de datos.",bibliografia_recomendada:["Fundamentos de Bases de Datos - Silberschatz, Korth & Sudarshan","Sistemas de Bases de Datos: Un enfoque práctico - Thomas Connolly, Carolyn Begg"]},
  {id:"TALF",semestre:3,nombre:"Teoría de Autómatas y Lenguajes Formales",creditos:8,previaturas:["EDA"],programa_analitico:"Máquinas de estado finito, expresiones regulares, gramáticas libres de contexto y máquinas de Turing. Base para el procesamiento de lenguaje natural.",bibliografia_recomendada:["Introducción a la teoría de autómatas, lenguajes y computación - Hopcroft, Motwani & Ullman","Teoría de la computación - Michael Sipser"]},
  {id:"MNC",semestre:3,nombre:"Métodos Numéricos Computacionales",creditos:8,previaturas:["ALL","PRO2"],programa_analitico:"Resolución de ecuaciones no lineales, sistemas de ecuaciones, interpolación, integración y derivación numérica mediante programación.",bibliografia_recomendada:["Métodos numéricos para ingenieros - Steven C. Chapra, Raymond P. Canale","Análisis numérico - Richard L. Burden, J. Douglas Faires"]},
  {id:"PRE",semestre:3,nombre:"Probabilidad y Estadística",creditos:8,previaturas:["MDI","MAT1"],programa_analitico:"Análisis de datos, distribuciones de probabilidad discretas y continuas, muestreo, estimación y pruebas de hipótesis (base para el machine learning).",bibliografia_recomendada:["Probabilidad y estadística para ingeniería y ciencias - Jay L. Devore","Estadística matemática con aplicaciones - Wackerly, Mendenhall & Scheaffer"]},
  {id:"ING3",semestre:3,nombre:"Inglés III",creditos:4,previaturas:[],programa_analitico:"Desarrollo avanzado de habilidades comunicativas y redacción técnica en inglés, orientado a la presentación de proyectos y lectura de material académico.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 4
  {id:"AA1",semestre:4,nombre:"Aprendizaje Automático I",creditos:8,previaturas:["PRE"],programa_analitico:"Fundamentos del aprendizaje automático, regresión lineal y logística, clasificación, evaluación de modelos y preprocesamiento de datos.",bibliografia_recomendada:["Hands-On Machine Learning with Scikit-Learn - Aurélien Géron","Pattern Recognition and Machine Learning - Christopher M. Bishop"]},
  {id:"BDN",semestre:4,nombre:"Bases de Datos NoSQL",creditos:8,previaturas:["BDR"],programa_analitico:"Paradigma NoSQL, bases de datos orientadas a documentos, grafos, clave-valor y columnas. Escalabilidad y manejo de Big Data.",bibliografia_recomendada:["NoSQL Distilled - Pramod J. Sadalage, Martin Fowler","Seven Databases in Seven Weeks - Luc Perkins"]},
  {id:"TITD",semestre:4,nombre:"Teoría de la Info. y Transmisión de Datos",creditos:8,previaturas:["PRE"],programa_analitico:"Entropía, codificación de fuentes, capacidad de canal, técnicas de modulación y fundamentos de redes de transmisión.",bibliografia_recomendada:["Elements of Information Theory - Thomas M. Cover","Data and Computer Communications - William Stallings"]},
  {id:"MOP",semestre:4,nombre:"Métodos de Optimización",creditos:8,previaturas:["ALL"],programa_analitico:"Programación lineal, método simplex, optimización convexa, descenso del gradiente y técnicas de optimización aplicadas a modelos de datos.",bibliografia_recomendada:["Convex Optimization - Stephen Boyd","Investigación de Operaciones - Hamdy A. Taha"]},
  {id:"MIN",semestre:4,nombre:"Metodología de la Investigación",creditos:4,previaturas:[],programa_analitico:"Diseño de investigación, planteamiento de problemas, elaboración de hipótesis, recolección de datos y escritura científica técnica.",bibliografia_recomendada:["Metodología de la investigación - Roberto Hernández Sampieri","Cómo se hace una tesis - Umberto Eco"]},
  {id:"ING4",semestre:4,nombre:"Inglés IV",creditos:4,previaturas:[],programa_analitico:"Consolidación de la gramática y el vocabulario técnico, orientado a la comprensión auditiva de conferencias y redacción de informes.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  // Semestre 5
  {id:"AA2",semestre:5,nombre:"Aprendizaje Automático II",creditos:8,previaturas:["AA1"],programa_analitico:"Técnicas avanzadas de machine learning, algoritmos de ensamble, máquinas de vectores de soporte (SVM) y reducción de dimensionalidad.",bibliografia_recomendada:["The Elements of Statistical Learning - Hastie, Tibshirani & Friedman"]},
  {id:"RCO",semestre:5,nombre:"Redes de Computadoras",creditos:8,previaturas:["TITD"],programa_analitico:"Arquitectura de redes, modelo OSI y TCP/IP. Análisis sobre amenazas, protocolos de enrutamiento y prácticas de configuración.",bibliografia_recomendada:["Computer Networks - Andrew S. Tanenbaum","Computer Networking: A Top-Down Approach - James Kurose"]},
  {id:"ERS",semestre:5,nombre:"Ética y Responsabilidad Social en TI",creditos:4,previaturas:[],programa_analitico:"Principios éticos y valores en TI, responsabilidad profesional, privacidad y seguridad digital, sesgos y discriminación en algoritmos e IA, impacto social de las TI (mercado laboral, salud), comunicación digital y desafíos para un futuro responsable.",bibliografia_recomendada:["Materiales seleccionados por el profesor"]},
  {id:"PID",semestre:5,nombre:"Proyecto de Ingeniería de Datos",creditos:8,previaturas:[],programa_analitico:"Proyecto integrador de diseño e implementación de una tubería de datos completa, integrando extracción, almacenamiento y puesta en producción.",bibliografia_recomendada:["Designing Data-Intensive Applications - Martin Kleppmann"]},
  {id:"ING5",semestre:5,nombre:"Inglés V",creditos:4,previaturas:[],programa_analitico:"Nivel intermedio-alto orientado a la argumentación técnica, debate sobre tecnología y lectura crítica de papers académicos.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"OPT1",semestre:5,nombre:"Optativa I",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  // Semestre 6
  {id:"AAA",semestre:6,nombre:"Aplicaciones del Aprendizaje Automático",creditos:8,previaturas:["AA2"],programa_analitico:"Implementación de modelos en producción. Procesamiento de lenguaje natural (NLP), visión por computadora y sistemas de recomendación.",bibliografia_recomendada:["Machine Learning Engineering - Andriy Burkov","Deep Learning for Vision Systems - Mohamed Elgendy"]},
  {id:"CSE",semestre:6,nombre:"Ciberseguridad",creditos:8,previaturas:["RCO"],programa_analitico:"Fundamentos de seguridad informática, amenazas y vulnerabilidades. Criptografía simétrica y asimétrica, seguridad en redes (SSL, TLS, VPN), gestión de identidades y accesos, seguridad en aplicaciones, análisis forense digital y hacking ético.",bibliografia_recomendada:["Computer Security: Principles and Practice - William Stallings, Lawrie Brown","Network Security: Private Communication in a Public World - Charlie Kaufman, Radia Perlman, Mike Speciner","Hacking: The Art of Exploitation - Jon Erickson"]},
  {id:"LNPD",semestre:6,nombre:"Leyes y normativas de Protección de Datos",creditos:4,previaturas:[],programa_analitico:"Conceptos y marcos legales de protección de datos a nivel mundial y nacional. Obligaciones de responsables y encargados, mecanismos de cumplimiento, sanciones, auditoría y marco legal para la transferencia internacional de datos.",bibliografia_recomendada:["Compendio de leyes y normativas de protección de datos seleccionadas por el Profesor"]},
  {id:"PAA",semestre:6,nombre:"Proyecto de Aprendizaje Automático",creditos:8,previaturas:["PID"],programa_analitico:"Proyecto integrador en el desarrollo de técnicas avanzadas en minería de datos, coincidencia de patrones y visualización.",bibliografia_recomendada:["Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow - Aurélien Géron"]},
  {id:"ING6",semestre:6,nombre:"Inglés VI",creditos:4,previaturas:[],programa_analitico:"Preparación para la certificación de nivel B2. Énfasis en la defensa oral de proyectos y fluidez en entornos laborales internacionales.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"OPT2",semestre:6,nombre:"Optativa II",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  // Semestre 7
  {id:"APR",semestre:7,nombre:"Aprendizaje Profundo",creditos:8,previaturas:["AAA","PAA"],programa_analitico:"Introducción al aprendizaje profundo y redes neuronales. Arquitecturas supervisadas y no supervisadas, redes recurrentes (RNN), procesamiento de secuencias y aplicaciones en visión por computadora, reconocimiento de voz y detección de anomalías utilizando frameworks especializados.",bibliografia_recomendada:["Deep Learning - Ian Goodfellow, Yoshua Bengio, Aaron Courville","Deep Learning with Python - Francois Chollet","Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow - Aurélien Géron"]},
  {id:"IBD",semestre:7,nombre:"Infraestructura de Big Data",creditos:8,previaturas:["BDN","PID"],programa_analitico:"Conceptos de Big Data (3Vs). Almacenamiento y procesamiento distribuido (Hadoop, Spark, NoSQL), arquitecturas Lambda y Kappa, escalabilidad, rendimiento, administración, monitoreo e integración de herramientas tecnológicas para grandes volúmenes de datos.",bibliografia_recomendada:["Hadoop: The Definitive Guide - Tom White","Spark: The Definitive Guide: Big Data Processing Made Simple - Bill Chambers, Matei Zaharia"]},
  {id:"AOGP",semestre:7,nombre:"Administración de Org. y Gestión de Proyectos",creditos:4,previaturas:[],programa_analitico:"Principios fundamentales de la administración en el contexto tecnológico. Procesos de planificación estratégica, gestión ágil e indicadores de rendimiento.",bibliografia_recomendada:["A Guide to the Project Management Body of Knowledge (PMBOK Guide) - PMI","Scrum: The Art of Doing Twice the Work in Half the Time - Jeff Sutherland"]},
  {id:"ING7",semestre:7,nombre:"Inglés VII",creditos:4,previaturas:[],programa_analitico:"Nivel avanzado (C1) enfocado en la redacción de papers, preparación de la tesis y presentaciones profesionales en la industria IT.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
  {id:"OPT3",semestre:7,nombre:"Optativa III",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  {id:"OPT4",semestre:7,nombre:"Optativa IV",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la profundización en áreas específicas de tecnología o gestión.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  // Semestre 8
  {id:"OPT5",semestre:8,nombre:"Optativa V",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la especialización tecnológica o desarrollo de habilidades transversales avanzadas.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  {id:"OPT6",semestre:8,nombre:"Optativa VI",creditos:4,previaturas:[],programa_analitico:"Unidad curricular electiva orientada a la especialización tecnológica o desarrollo de habilidades transversales avanzadas.",bibliografia_recomendada:["Bibliografía dependiente de la unidad electiva cursada"]},
  {id:"ING8",semestre:8,nombre:"Inglés VIII",creditos:4,previaturas:[],programa_analitico:"Nivel avanzado superior. Preparación integral para la inserción laboral global, entrevistas técnicas en inglés y liderazgo de proyectos internacionales.",bibliografia_recomendada:["Plataforma interactiva provista por el departamento de idiomas de UTEC"]},
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
function buildTheme(label, { pageBg, headerBg, headerBorder, semHdrBg, semNum, semLabel, semCr, hintText, hintPrev, hintHab, cNBg, cNBorder, cNBar, cNName, cNId, cNBadgeBg, cDBg, cDName, cSBg, cSBorder, cSName, cPBg, cPBorder, cPName, cPId, cPBadgeBg, cHBg, cHBorder, cHName, cHId, cHBadgeBg, infoBg, infoColor, mBg, mTitle, mText, mDivider, mBadgePrevBg, mBadgePrevText, mBadgeHabBg, mBadgeHabText, toggleBg, toggleColor, hoverClaro }) {
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
    legDotSel: cSBorder, legDotPrev: hintPrev, legDotHab: hintHab, legText: semLabel, clearColor: hintText,
    hoverClaro // Propiedad añadida para el hover brillante
  };
}

// 2 modos: Oscuro (Everforest Dark Hard) y Claro (Everforest Light Soft)
const THEMES = {
  oscuro: buildTheme("Modo Oscuro", { 
    pageBg:"#232a2e", headerBg:"rgba(35,42,46,0.95)", headerBorder:"#2d353b", 
    semHdrBg:"#2d353b", semNum:"#d3c6aa", semLabel:"#9da9a0", semCr:"#859289", 
    hintText:"#859289", hintPrev:"#e69875", hintHab:"#a7c080", 
    cNBg:"#2d353b", cNBorder:"#343f44", cNBar:"#475258", cNName:"#d3c6aa", cNId:"#9da9a0", cNBadgeBg:"#232a2e", 
    cDBg:"#1e2326", cDName:"#5c6a72", 
    cSBg:"#343f44", cSBorder:"#7fbbb3", cSName:"#7fbbb3", 
    cPBg:"#2d353b", cPBorder:"#e69875", cPName:"#e69875", cPId:"#e69875", cPBadgeBg:"#1e2326", 
    cHBg:"#2d353b", cHBorder:"#a7c080", cHName:"#a7c080", cHId:"#a7c080", cHBadgeBg:"#1e2326", 
    infoBg:"#2d353b", infoColor:"#d3c6aa", 
    mBg:"#2d353b", mTitle:"#d3c6aa", mText:"#d3c6aa", mDivider:"#343f44", 
    mBadgePrevBg:"#232a2e", mBadgePrevText:"#e69875", 
    mBadgeHabBg:"#232a2e", mBadgeHabText:"#a7c080", 
    toggleBg:"#343f44", toggleColor:"#7fbbb3",
    hoverClaro:"#d3c6aa" // Este es el color claro que brillará al hacer hover
  }),

  claro: buildTheme("Modo Claro", { 
    pageBg:"#f3f0e1", headerBg:"rgba(243,240,225,0.95)", headerBorder:"rgba(92,106,114,0.15)", 
    semHdrBg:"#e6e2cc", semNum:"#5c6a72", semLabel:"rgba(92,106,114,0.6)", semCr:"rgba(92,106,114,0.5)", 
    hintText:"rgba(92,106,114,0.55)", hintPrev:"#f57d26", hintHab:"#8da101", 
    cNBg:"#fdf6e3", cNBorder:"rgba(92,106,114,0.15)", cNBar:"#dfddc8", cNName:"#4f5b58", cNId:"#829181", cNBadgeBg:"#e6e2cc", 
    cDBg:"#f3f0e1", cDName:"rgba(92,106,114,0.4)", 
    cSBg:"#ffffff", cSBorder:"#3a94c5", cSName:"#3a94c5", 
    cPBg:"#fdf6e3", cPBorder:"#f57d26", cPName:"#dfa000", cPId:"#f57d26", cPBadgeBg:"#f3f0e1", 
    cHBg:"#fdf6e3", cHBorder:"#8da101", cHName:"#8da101", cHId:"#8da101", cHBadgeBg:"#f3f0e1", 
    infoBg:"#e6e2cc", infoColor:"#5c6a72", 
    mBg:"#fdf6e3", mTitle:"#4f5b58", mText:"#5c6a72", mDivider:"rgba(92,106,114,0.15)", 
    mBadgePrevBg:"#f3f0e1", mBadgePrevText:"#f57d26", 
    mBadgeHabBg:"#f3f0e1", mBadgeHabText:"#8da101", 
    toggleBg:"#e6e2cc", toggleColor:"#5c6a72" 
  })
};

const THEME_ORDER = ["claro", "oscuro"];


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
  const [hovered, setHovered] = useState(false);
  const dim = state === "dim";
  const sel = state === "selected";
  const prev = state === "previa";
  const hab = state === "habilitada";
  const isUnconf = materia.isUnconfiguredOptativa;
  const isConfOpt = materia.isConfiguredOptativa;

  const showActionBtn = sel || prev || hab;

  let bg, border, bar, nameC, idC;
  if (dim) {
    bg = t.cDBg; border = t.cDBorder; bar = "transparent"; nameC = t.cDName; idC = t.cDName;
  } else if (sel) {
    bg = t.cSBg; border = t.cSBorder; bar = t.cSBar; nameC = t.cSName; idC = t.cSId;
  } else if (prev) {
    bg = t.cPBg; border = t.cPBorder; bar = t.cPBar; nameC = t.cPName; idC = t.cPId;
  } else if (hab) {
    bg = t.cHBg; border = t.cHBorder; bar = t.cHBar; nameC = t.cHName; idC = t.cHId;
  } else {
    bg = t.cNBg; border = t.cNBorder; bar = t.cNBar; nameC = t.cNName; idC = t.cNId;
  }

  if (isUnconf && !sel && !dim) {
    bg = "transparent"; border = t.mDivider; bar = "transparent"; nameC = t.hintText;
  }

  const actionBtnBg = bar && bar !== "transparent" ? bar : "#3a94c5";

  // Lógica actualizada para el hover
  const isHovering = hovered && !dim;
  
  // Si tenemos "hoverClaro" (modo oscuro), lo usamos. Si no, usamos el comportamiento normal
  const activeHoverBorder = isHovering 
    ? (t.hoverClaro || (bar && bar !== "transparent" ? bar : t.cSBorder)) 
    : border;

  const longestWord = materia.nombre.split(" ").reduce((a, w) => (w.length > a.length ? w : a), "");
  const titleSizeClass =
    longestWord.length > 13 ? "text-sm tracking-normal" :
    longestWord.length > 9 ? "text-base tracking-normal" :
    "text-lg tracking-wide";

  return (
    <div 
      onClick={dim ? undefined : (e) => { e.stopPropagation(); onCardClick(e); }}
      onMouseEnter={() => !dim && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={dim ? undefined : "button"}
      tabIndex={dim ? -1 : 0}
      onKeyDown={dim ? undefined : (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick(e);
        }
      }}
      className="relative rounded-2xl overflow-hidden transition-all duration-200 ease-out flex flex-col w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: bg,
        border: `2px ${ (isUnconf || isConfOpt) ? 'dashed' : 'solid' } ${activeHoverBorder}`,
        cursor: dim ? "default" : "pointer",
        opacity: dim ? 0.32 : 1,
        // Sombra especial clara para el modo oscuro si está haciendo hover
        boxShadow: sel
          ? `0 4px 14px rgba(0,0,0,0.25)`
          : isHovering
          ? (t.hoverClaro ? `0 8px 24px rgba(211, 198, 170, 0.15)` : `0 10px 24px rgba(0,0,0,0.22)`)
          : "none",
        transform: isHovering ? "translateY(-3px) scale(1.015)" : "translateY(0) scale(1)",
        minHeight: "145px"
      }}
    >
      <div className="p-4 flex flex-col justify-between flex-1 pb-5">
        <span className="text-[11px] font-mono tracking-wider uppercase opacity-80" style={{ color: idC }}>
          {materia.id}
        </span>
        <h3
          className={`font-extrabold uppercase leading-tight my-2 flex-1 flex items-center ${titleSizeClass}`}
          style={{ color: nameC, wordBreak: "normal", overflowWrap: "normal", hyphens: "none" }}
        >
          {isUnconf ? `[ ELEGIR OPTATIVA ]` : materia.nombre.toUpperCase()}
        </h3>
        <div className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: idC }}>
          {materia.creditos} CRÉDITOS
        </div>
      </div>

      {showActionBtn && (
        <button
          onClick={(e) => { e.stopPropagation(); onInfo(); }}
          className="absolute bottom-0 right-0 w-12 h-12 flex items-center justify-center rounded-tl-xl transition-transform hover:brightness-110 active:scale-95"
          style={{ backgroundColor: actionBtnBg, color: "#ffffff", cursor: "pointer" }}
          title="Ver detalles"
          aria-label={`Ver detalles de ${materia.nombre}`}
        >
          <span className="text-2xl font-light select-none -translate-y-[1px]">+</span>
        </button>
      )}
    </div>
  );
}
// ─── THEME SWITCHER (toggle simple: Modo Claro / Modo Oscuro) ─────────────────
function ThemeSwitcher({ current, onChange, t }) {
  const isDark = current === "oscuro";
  return (
    <button
      onClick={() => onChange(isDark ? "claro" : "oscuro")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition hover:opacity-80 active:scale-95"
      style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      aria-label={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      <span>{isDark ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{t.label}</span>
    </button>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  // 1. Inicializamos el estado buscando si ya existe un tema guardado en el navegador
  const [themeKey, setThemeKey] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selected-theme');
      if (saved && THEMES[saved]) return saved;
    }
    return "oscuro"; // Tema por defecto si no hay registro
  });

  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [modalSlotId, setModalSlotId] = useState(null);
  const [optativasConfig, setOptativasConfig] = useState({});

  const t = THEMES[themeKey] || THEMES.oscuro;

  // 2. Guardamos en localStorage cada vez que cambia el tema
  useEffect(() => {
    localStorage.setItem('selected-theme', themeKey);
    // Cambia el fondo del body para evitar cortes visuales raros al hacer scroll
    document.body.style.backgroundColor = t.pageBg;
  }, [themeKey, t.pageBg]);

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
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: t.pageBg, transition: "background-color 0.25s" }}
      // 👇 ACÁ ESTÁ EL CAMBIO PARA DESELECCIONAR
      onClick={() => setSelectedSlotId(null)}>
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
        ) : "Click en una materia para ver sus dependencias · + para más detalles"}
      </div>

      {/* ── Grid ── */}
      <main className="max-w-[1700px] mx-auto px-3 sm:px-5 py-5">
        <div className="overflow-x-auto pb-6">
          <div className="grid gap-3 min-w-[1600px]" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
            {SEMESTRES.map(s => {
              const mats = effectiveMaterias.filter(m => m.semestre === s || m.slotSemestre === s);
              return (
                <div key={s} className="flex flex-col gap-2.5">
                  <div className="text-center pb-3 pt-1 select-none">
                    <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: t.semLabel }}>SEMESTRE</div>
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