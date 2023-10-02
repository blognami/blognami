(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../node_modules/html-entities/lib/named-references.js
  var require_named_references = __commonJS({
    "../../node_modules/html-entities/lib/named-references.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bodyRegExps = { xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g, html4: /&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g, html5: /&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g };
      exports.namedReferences = { xml: { entities: { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&amp;": "&" }, characters: { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;", "&": "&amp;" } }, html4: { entities: { "&apos;": "'", "&nbsp": "\xA0", "&nbsp;": "\xA0", "&iexcl": "\xA1", "&iexcl;": "\xA1", "&cent": "\xA2", "&cent;": "\xA2", "&pound": "\xA3", "&pound;": "\xA3", "&curren": "\xA4", "&curren;": "\xA4", "&yen": "\xA5", "&yen;": "\xA5", "&brvbar": "\xA6", "&brvbar;": "\xA6", "&sect": "\xA7", "&sect;": "\xA7", "&uml": "\xA8", "&uml;": "\xA8", "&copy": "\xA9", "&copy;": "\xA9", "&ordf": "\xAA", "&ordf;": "\xAA", "&laquo": "\xAB", "&laquo;": "\xAB", "&not": "\xAC", "&not;": "\xAC", "&shy": "\xAD", "&shy;": "\xAD", "&reg": "\xAE", "&reg;": "\xAE", "&macr": "\xAF", "&macr;": "\xAF", "&deg": "\xB0", "&deg;": "\xB0", "&plusmn": "\xB1", "&plusmn;": "\xB1", "&sup2": "\xB2", "&sup2;": "\xB2", "&sup3": "\xB3", "&sup3;": "\xB3", "&acute": "\xB4", "&acute;": "\xB4", "&micro": "\xB5", "&micro;": "\xB5", "&para": "\xB6", "&para;": "\xB6", "&middot": "\xB7", "&middot;": "\xB7", "&cedil": "\xB8", "&cedil;": "\xB8", "&sup1": "\xB9", "&sup1;": "\xB9", "&ordm": "\xBA", "&ordm;": "\xBA", "&raquo": "\xBB", "&raquo;": "\xBB", "&frac14": "\xBC", "&frac14;": "\xBC", "&frac12": "\xBD", "&frac12;": "\xBD", "&frac34": "\xBE", "&frac34;": "\xBE", "&iquest": "\xBF", "&iquest;": "\xBF", "&Agrave": "\xC0", "&Agrave;": "\xC0", "&Aacute": "\xC1", "&Aacute;": "\xC1", "&Acirc": "\xC2", "&Acirc;": "\xC2", "&Atilde": "\xC3", "&Atilde;": "\xC3", "&Auml": "\xC4", "&Auml;": "\xC4", "&Aring": "\xC5", "&Aring;": "\xC5", "&AElig": "\xC6", "&AElig;": "\xC6", "&Ccedil": "\xC7", "&Ccedil;": "\xC7", "&Egrave": "\xC8", "&Egrave;": "\xC8", "&Eacute": "\xC9", "&Eacute;": "\xC9", "&Ecirc": "\xCA", "&Ecirc;": "\xCA", "&Euml": "\xCB", "&Euml;": "\xCB", "&Igrave": "\xCC", "&Igrave;": "\xCC", "&Iacute": "\xCD", "&Iacute;": "\xCD", "&Icirc": "\xCE", "&Icirc;": "\xCE", "&Iuml": "\xCF", "&Iuml;": "\xCF", "&ETH": "\xD0", "&ETH;": "\xD0", "&Ntilde": "\xD1", "&Ntilde;": "\xD1", "&Ograve": "\xD2", "&Ograve;": "\xD2", "&Oacute": "\xD3", "&Oacute;": "\xD3", "&Ocirc": "\xD4", "&Ocirc;": "\xD4", "&Otilde": "\xD5", "&Otilde;": "\xD5", "&Ouml": "\xD6", "&Ouml;": "\xD6", "&times": "\xD7", "&times;": "\xD7", "&Oslash": "\xD8", "&Oslash;": "\xD8", "&Ugrave": "\xD9", "&Ugrave;": "\xD9", "&Uacute": "\xDA", "&Uacute;": "\xDA", "&Ucirc": "\xDB", "&Ucirc;": "\xDB", "&Uuml": "\xDC", "&Uuml;": "\xDC", "&Yacute": "\xDD", "&Yacute;": "\xDD", "&THORN": "\xDE", "&THORN;": "\xDE", "&szlig": "\xDF", "&szlig;": "\xDF", "&agrave": "\xE0", "&agrave;": "\xE0", "&aacute": "\xE1", "&aacute;": "\xE1", "&acirc": "\xE2", "&acirc;": "\xE2", "&atilde": "\xE3", "&atilde;": "\xE3", "&auml": "\xE4", "&auml;": "\xE4", "&aring": "\xE5", "&aring;": "\xE5", "&aelig": "\xE6", "&aelig;": "\xE6", "&ccedil": "\xE7", "&ccedil;": "\xE7", "&egrave": "\xE8", "&egrave;": "\xE8", "&eacute": "\xE9", "&eacute;": "\xE9", "&ecirc": "\xEA", "&ecirc;": "\xEA", "&euml": "\xEB", "&euml;": "\xEB", "&igrave": "\xEC", "&igrave;": "\xEC", "&iacute": "\xED", "&iacute;": "\xED", "&icirc": "\xEE", "&icirc;": "\xEE", "&iuml": "\xEF", "&iuml;": "\xEF", "&eth": "\xF0", "&eth;": "\xF0", "&ntilde": "\xF1", "&ntilde;": "\xF1", "&ograve": "\xF2", "&ograve;": "\xF2", "&oacute": "\xF3", "&oacute;": "\xF3", "&ocirc": "\xF4", "&ocirc;": "\xF4", "&otilde": "\xF5", "&otilde;": "\xF5", "&ouml": "\xF6", "&ouml;": "\xF6", "&divide": "\xF7", "&divide;": "\xF7", "&oslash": "\xF8", "&oslash;": "\xF8", "&ugrave": "\xF9", "&ugrave;": "\xF9", "&uacute": "\xFA", "&uacute;": "\xFA", "&ucirc": "\xFB", "&ucirc;": "\xFB", "&uuml": "\xFC", "&uuml;": "\xFC", "&yacute": "\xFD", "&yacute;": "\xFD", "&thorn": "\xFE", "&thorn;": "\xFE", "&yuml": "\xFF", "&yuml;": "\xFF", "&quot": '"', "&quot;": '"', "&amp": "&", "&amp;": "&", "&lt": "<", "&lt;": "<", "&gt": ">", "&gt;": ">", "&OElig;": "\u0152", "&oelig;": "\u0153", "&Scaron;": "\u0160", "&scaron;": "\u0161", "&Yuml;": "\u0178", "&circ;": "\u02C6", "&tilde;": "\u02DC", "&ensp;": "\u2002", "&emsp;": "\u2003", "&thinsp;": "\u2009", "&zwnj;": "\u200C", "&zwj;": "\u200D", "&lrm;": "\u200E", "&rlm;": "\u200F", "&ndash;": "\u2013", "&mdash;": "\u2014", "&lsquo;": "\u2018", "&rsquo;": "\u2019", "&sbquo;": "\u201A", "&ldquo;": "\u201C", "&rdquo;": "\u201D", "&bdquo;": "\u201E", "&dagger;": "\u2020", "&Dagger;": "\u2021", "&permil;": "\u2030", "&lsaquo;": "\u2039", "&rsaquo;": "\u203A", "&euro;": "\u20AC", "&fnof;": "\u0192", "&Alpha;": "\u0391", "&Beta;": "\u0392", "&Gamma;": "\u0393", "&Delta;": "\u0394", "&Epsilon;": "\u0395", "&Zeta;": "\u0396", "&Eta;": "\u0397", "&Theta;": "\u0398", "&Iota;": "\u0399", "&Kappa;": "\u039A", "&Lambda;": "\u039B", "&Mu;": "\u039C", "&Nu;": "\u039D", "&Xi;": "\u039E", "&Omicron;": "\u039F", "&Pi;": "\u03A0", "&Rho;": "\u03A1", "&Sigma;": "\u03A3", "&Tau;": "\u03A4", "&Upsilon;": "\u03A5", "&Phi;": "\u03A6", "&Chi;": "\u03A7", "&Psi;": "\u03A8", "&Omega;": "\u03A9", "&alpha;": "\u03B1", "&beta;": "\u03B2", "&gamma;": "\u03B3", "&delta;": "\u03B4", "&epsilon;": "\u03B5", "&zeta;": "\u03B6", "&eta;": "\u03B7", "&theta;": "\u03B8", "&iota;": "\u03B9", "&kappa;": "\u03BA", "&lambda;": "\u03BB", "&mu;": "\u03BC", "&nu;": "\u03BD", "&xi;": "\u03BE", "&omicron;": "\u03BF", "&pi;": "\u03C0", "&rho;": "\u03C1", "&sigmaf;": "\u03C2", "&sigma;": "\u03C3", "&tau;": "\u03C4", "&upsilon;": "\u03C5", "&phi;": "\u03C6", "&chi;": "\u03C7", "&psi;": "\u03C8", "&omega;": "\u03C9", "&thetasym;": "\u03D1", "&upsih;": "\u03D2", "&piv;": "\u03D6", "&bull;": "\u2022", "&hellip;": "\u2026", "&prime;": "\u2032", "&Prime;": "\u2033", "&oline;": "\u203E", "&frasl;": "\u2044", "&weierp;": "\u2118", "&image;": "\u2111", "&real;": "\u211C", "&trade;": "\u2122", "&alefsym;": "\u2135", "&larr;": "\u2190", "&uarr;": "\u2191", "&rarr;": "\u2192", "&darr;": "\u2193", "&harr;": "\u2194", "&crarr;": "\u21B5", "&lArr;": "\u21D0", "&uArr;": "\u21D1", "&rArr;": "\u21D2", "&dArr;": "\u21D3", "&hArr;": "\u21D4", "&forall;": "\u2200", "&part;": "\u2202", "&exist;": "\u2203", "&empty;": "\u2205", "&nabla;": "\u2207", "&isin;": "\u2208", "&notin;": "\u2209", "&ni;": "\u220B", "&prod;": "\u220F", "&sum;": "\u2211", "&minus;": "\u2212", "&lowast;": "\u2217", "&radic;": "\u221A", "&prop;": "\u221D", "&infin;": "\u221E", "&ang;": "\u2220", "&and;": "\u2227", "&or;": "\u2228", "&cap;": "\u2229", "&cup;": "\u222A", "&int;": "\u222B", "&there4;": "\u2234", "&sim;": "\u223C", "&cong;": "\u2245", "&asymp;": "\u2248", "&ne;": "\u2260", "&equiv;": "\u2261", "&le;": "\u2264", "&ge;": "\u2265", "&sub;": "\u2282", "&sup;": "\u2283", "&nsub;": "\u2284", "&sube;": "\u2286", "&supe;": "\u2287", "&oplus;": "\u2295", "&otimes;": "\u2297", "&perp;": "\u22A5", "&sdot;": "\u22C5", "&lceil;": "\u2308", "&rceil;": "\u2309", "&lfloor;": "\u230A", "&rfloor;": "\u230B", "&lang;": "\u2329", "&rang;": "\u232A", "&loz;": "\u25CA", "&spades;": "\u2660", "&clubs;": "\u2663", "&hearts;": "\u2665", "&diams;": "\u2666" }, characters: { "'": "&apos;", "\xA0": "&nbsp;", "\xA1": "&iexcl;", "\xA2": "&cent;", "\xA3": "&pound;", "\xA4": "&curren;", "\xA5": "&yen;", "\xA6": "&brvbar;", "\xA7": "&sect;", "\xA8": "&uml;", "\xA9": "&copy;", "\xAA": "&ordf;", "\xAB": "&laquo;", "\xAC": "&not;", "\xAD": "&shy;", "\xAE": "&reg;", "\xAF": "&macr;", "\xB0": "&deg;", "\xB1": "&plusmn;", "\xB2": "&sup2;", "\xB3": "&sup3;", "\xB4": "&acute;", "\xB5": "&micro;", "\xB6": "&para;", "\xB7": "&middot;", "\xB8": "&cedil;", "\xB9": "&sup1;", "\xBA": "&ordm;", "\xBB": "&raquo;", "\xBC": "&frac14;", "\xBD": "&frac12;", "\xBE": "&frac34;", "\xBF": "&iquest;", "\xC0": "&Agrave;", "\xC1": "&Aacute;", "\xC2": "&Acirc;", "\xC3": "&Atilde;", "\xC4": "&Auml;", "\xC5": "&Aring;", "\xC6": "&AElig;", "\xC7": "&Ccedil;", "\xC8": "&Egrave;", "\xC9": "&Eacute;", "\xCA": "&Ecirc;", "\xCB": "&Euml;", "\xCC": "&Igrave;", "\xCD": "&Iacute;", "\xCE": "&Icirc;", "\xCF": "&Iuml;", "\xD0": "&ETH;", "\xD1": "&Ntilde;", "\xD2": "&Ograve;", "\xD3": "&Oacute;", "\xD4": "&Ocirc;", "\xD5": "&Otilde;", "\xD6": "&Ouml;", "\xD7": "&times;", "\xD8": "&Oslash;", "\xD9": "&Ugrave;", "\xDA": "&Uacute;", "\xDB": "&Ucirc;", "\xDC": "&Uuml;", "\xDD": "&Yacute;", "\xDE": "&THORN;", "\xDF": "&szlig;", "\xE0": "&agrave;", "\xE1": "&aacute;", "\xE2": "&acirc;", "\xE3": "&atilde;", "\xE4": "&auml;", "\xE5": "&aring;", "\xE6": "&aelig;", "\xE7": "&ccedil;", "\xE8": "&egrave;", "\xE9": "&eacute;", "\xEA": "&ecirc;", "\xEB": "&euml;", "\xEC": "&igrave;", "\xED": "&iacute;", "\xEE": "&icirc;", "\xEF": "&iuml;", "\xF0": "&eth;", "\xF1": "&ntilde;", "\xF2": "&ograve;", "\xF3": "&oacute;", "\xF4": "&ocirc;", "\xF5": "&otilde;", "\xF6": "&ouml;", "\xF7": "&divide;", "\xF8": "&oslash;", "\xF9": "&ugrave;", "\xFA": "&uacute;", "\xFB": "&ucirc;", "\xFC": "&uuml;", "\xFD": "&yacute;", "\xFE": "&thorn;", "\xFF": "&yuml;", '"': "&quot;", "&": "&amp;", "<": "&lt;", ">": "&gt;", "\u0152": "&OElig;", "\u0153": "&oelig;", "\u0160": "&Scaron;", "\u0161": "&scaron;", "\u0178": "&Yuml;", "\u02C6": "&circ;", "\u02DC": "&tilde;", "\u2002": "&ensp;", "\u2003": "&emsp;", "\u2009": "&thinsp;", "\u200C": "&zwnj;", "\u200D": "&zwj;", "\u200E": "&lrm;", "\u200F": "&rlm;", "\u2013": "&ndash;", "\u2014": "&mdash;", "\u2018": "&lsquo;", "\u2019": "&rsquo;", "\u201A": "&sbquo;", "\u201C": "&ldquo;", "\u201D": "&rdquo;", "\u201E": "&bdquo;", "\u2020": "&dagger;", "\u2021": "&Dagger;", "\u2030": "&permil;", "\u2039": "&lsaquo;", "\u203A": "&rsaquo;", "\u20AC": "&euro;", "\u0192": "&fnof;", "\u0391": "&Alpha;", "\u0392": "&Beta;", "\u0393": "&Gamma;", "\u0394": "&Delta;", "\u0395": "&Epsilon;", "\u0396": "&Zeta;", "\u0397": "&Eta;", "\u0398": "&Theta;", "\u0399": "&Iota;", "\u039A": "&Kappa;", "\u039B": "&Lambda;", "\u039C": "&Mu;", "\u039D": "&Nu;", "\u039E": "&Xi;", "\u039F": "&Omicron;", "\u03A0": "&Pi;", "\u03A1": "&Rho;", "\u03A3": "&Sigma;", "\u03A4": "&Tau;", "\u03A5": "&Upsilon;", "\u03A6": "&Phi;", "\u03A7": "&Chi;", "\u03A8": "&Psi;", "\u03A9": "&Omega;", "\u03B1": "&alpha;", "\u03B2": "&beta;", "\u03B3": "&gamma;", "\u03B4": "&delta;", "\u03B5": "&epsilon;", "\u03B6": "&zeta;", "\u03B7": "&eta;", "\u03B8": "&theta;", "\u03B9": "&iota;", "\u03BA": "&kappa;", "\u03BB": "&lambda;", "\u03BC": "&mu;", "\u03BD": "&nu;", "\u03BE": "&xi;", "\u03BF": "&omicron;", "\u03C0": "&pi;", "\u03C1": "&rho;", "\u03C2": "&sigmaf;", "\u03C3": "&sigma;", "\u03C4": "&tau;", "\u03C5": "&upsilon;", "\u03C6": "&phi;", "\u03C7": "&chi;", "\u03C8": "&psi;", "\u03C9": "&omega;", "\u03D1": "&thetasym;", "\u03D2": "&upsih;", "\u03D6": "&piv;", "\u2022": "&bull;", "\u2026": "&hellip;", "\u2032": "&prime;", "\u2033": "&Prime;", "\u203E": "&oline;", "\u2044": "&frasl;", "\u2118": "&weierp;", "\u2111": "&image;", "\u211C": "&real;", "\u2122": "&trade;", "\u2135": "&alefsym;", "\u2190": "&larr;", "\u2191": "&uarr;", "\u2192": "&rarr;", "\u2193": "&darr;", "\u2194": "&harr;", "\u21B5": "&crarr;", "\u21D0": "&lArr;", "\u21D1": "&uArr;", "\u21D2": "&rArr;", "\u21D3": "&dArr;", "\u21D4": "&hArr;", "\u2200": "&forall;", "\u2202": "&part;", "\u2203": "&exist;", "\u2205": "&empty;", "\u2207": "&nabla;", "\u2208": "&isin;", "\u2209": "&notin;", "\u220B": "&ni;", "\u220F": "&prod;", "\u2211": "&sum;", "\u2212": "&minus;", "\u2217": "&lowast;", "\u221A": "&radic;", "\u221D": "&prop;", "\u221E": "&infin;", "\u2220": "&ang;", "\u2227": "&and;", "\u2228": "&or;", "\u2229": "&cap;", "\u222A": "&cup;", "\u222B": "&int;", "\u2234": "&there4;", "\u223C": "&sim;", "\u2245": "&cong;", "\u2248": "&asymp;", "\u2260": "&ne;", "\u2261": "&equiv;", "\u2264": "&le;", "\u2265": "&ge;", "\u2282": "&sub;", "\u2283": "&sup;", "\u2284": "&nsub;", "\u2286": "&sube;", "\u2287": "&supe;", "\u2295": "&oplus;", "\u2297": "&otimes;", "\u22A5": "&perp;", "\u22C5": "&sdot;", "\u2308": "&lceil;", "\u2309": "&rceil;", "\u230A": "&lfloor;", "\u230B": "&rfloor;", "\u2329": "&lang;", "\u232A": "&rang;", "\u25CA": "&loz;", "\u2660": "&spades;", "\u2663": "&clubs;", "\u2665": "&hearts;", "\u2666": "&diams;" } }, html5: { entities: { "&AElig": "\xC6", "&AElig;": "\xC6", "&AMP": "&", "&AMP;": "&", "&Aacute": "\xC1", "&Aacute;": "\xC1", "&Abreve;": "\u0102", "&Acirc": "\xC2", "&Acirc;": "\xC2", "&Acy;": "\u0410", "&Afr;": "\u{1D504}", "&Agrave": "\xC0", "&Agrave;": "\xC0", "&Alpha;": "\u0391", "&Amacr;": "\u0100", "&And;": "\u2A53", "&Aogon;": "\u0104", "&Aopf;": "\u{1D538}", "&ApplyFunction;": "\u2061", "&Aring": "\xC5", "&Aring;": "\xC5", "&Ascr;": "\u{1D49C}", "&Assign;": "\u2254", "&Atilde": "\xC3", "&Atilde;": "\xC3", "&Auml": "\xC4", "&Auml;": "\xC4", "&Backslash;": "\u2216", "&Barv;": "\u2AE7", "&Barwed;": "\u2306", "&Bcy;": "\u0411", "&Because;": "\u2235", "&Bernoullis;": "\u212C", "&Beta;": "\u0392", "&Bfr;": "\u{1D505}", "&Bopf;": "\u{1D539}", "&Breve;": "\u02D8", "&Bscr;": "\u212C", "&Bumpeq;": "\u224E", "&CHcy;": "\u0427", "&COPY": "\xA9", "&COPY;": "\xA9", "&Cacute;": "\u0106", "&Cap;": "\u22D2", "&CapitalDifferentialD;": "\u2145", "&Cayleys;": "\u212D", "&Ccaron;": "\u010C", "&Ccedil": "\xC7", "&Ccedil;": "\xC7", "&Ccirc;": "\u0108", "&Cconint;": "\u2230", "&Cdot;": "\u010A", "&Cedilla;": "\xB8", "&CenterDot;": "\xB7", "&Cfr;": "\u212D", "&Chi;": "\u03A7", "&CircleDot;": "\u2299", "&CircleMinus;": "\u2296", "&CirclePlus;": "\u2295", "&CircleTimes;": "\u2297", "&ClockwiseContourIntegral;": "\u2232", "&CloseCurlyDoubleQuote;": "\u201D", "&CloseCurlyQuote;": "\u2019", "&Colon;": "\u2237", "&Colone;": "\u2A74", "&Congruent;": "\u2261", "&Conint;": "\u222F", "&ContourIntegral;": "\u222E", "&Copf;": "\u2102", "&Coproduct;": "\u2210", "&CounterClockwiseContourIntegral;": "\u2233", "&Cross;": "\u2A2F", "&Cscr;": "\u{1D49E}", "&Cup;": "\u22D3", "&CupCap;": "\u224D", "&DD;": "\u2145", "&DDotrahd;": "\u2911", "&DJcy;": "\u0402", "&DScy;": "\u0405", "&DZcy;": "\u040F", "&Dagger;": "\u2021", "&Darr;": "\u21A1", "&Dashv;": "\u2AE4", "&Dcaron;": "\u010E", "&Dcy;": "\u0414", "&Del;": "\u2207", "&Delta;": "\u0394", "&Dfr;": "\u{1D507}", "&DiacriticalAcute;": "\xB4", "&DiacriticalDot;": "\u02D9", "&DiacriticalDoubleAcute;": "\u02DD", "&DiacriticalGrave;": "`", "&DiacriticalTilde;": "\u02DC", "&Diamond;": "\u22C4", "&DifferentialD;": "\u2146", "&Dopf;": "\u{1D53B}", "&Dot;": "\xA8", "&DotDot;": "\u20DC", "&DotEqual;": "\u2250", "&DoubleContourIntegral;": "\u222F", "&DoubleDot;": "\xA8", "&DoubleDownArrow;": "\u21D3", "&DoubleLeftArrow;": "\u21D0", "&DoubleLeftRightArrow;": "\u21D4", "&DoubleLeftTee;": "\u2AE4", "&DoubleLongLeftArrow;": "\u27F8", "&DoubleLongLeftRightArrow;": "\u27FA", "&DoubleLongRightArrow;": "\u27F9", "&DoubleRightArrow;": "\u21D2", "&DoubleRightTee;": "\u22A8", "&DoubleUpArrow;": "\u21D1", "&DoubleUpDownArrow;": "\u21D5", "&DoubleVerticalBar;": "\u2225", "&DownArrow;": "\u2193", "&DownArrowBar;": "\u2913", "&DownArrowUpArrow;": "\u21F5", "&DownBreve;": "\u0311", "&DownLeftRightVector;": "\u2950", "&DownLeftTeeVector;": "\u295E", "&DownLeftVector;": "\u21BD", "&DownLeftVectorBar;": "\u2956", "&DownRightTeeVector;": "\u295F", "&DownRightVector;": "\u21C1", "&DownRightVectorBar;": "\u2957", "&DownTee;": "\u22A4", "&DownTeeArrow;": "\u21A7", "&Downarrow;": "\u21D3", "&Dscr;": "\u{1D49F}", "&Dstrok;": "\u0110", "&ENG;": "\u014A", "&ETH": "\xD0", "&ETH;": "\xD0", "&Eacute": "\xC9", "&Eacute;": "\xC9", "&Ecaron;": "\u011A", "&Ecirc": "\xCA", "&Ecirc;": "\xCA", "&Ecy;": "\u042D", "&Edot;": "\u0116", "&Efr;": "\u{1D508}", "&Egrave": "\xC8", "&Egrave;": "\xC8", "&Element;": "\u2208", "&Emacr;": "\u0112", "&EmptySmallSquare;": "\u25FB", "&EmptyVerySmallSquare;": "\u25AB", "&Eogon;": "\u0118", "&Eopf;": "\u{1D53C}", "&Epsilon;": "\u0395", "&Equal;": "\u2A75", "&EqualTilde;": "\u2242", "&Equilibrium;": "\u21CC", "&Escr;": "\u2130", "&Esim;": "\u2A73", "&Eta;": "\u0397", "&Euml": "\xCB", "&Euml;": "\xCB", "&Exists;": "\u2203", "&ExponentialE;": "\u2147", "&Fcy;": "\u0424", "&Ffr;": "\u{1D509}", "&FilledSmallSquare;": "\u25FC", "&FilledVerySmallSquare;": "\u25AA", "&Fopf;": "\u{1D53D}", "&ForAll;": "\u2200", "&Fouriertrf;": "\u2131", "&Fscr;": "\u2131", "&GJcy;": "\u0403", "&GT": ">", "&GT;": ">", "&Gamma;": "\u0393", "&Gammad;": "\u03DC", "&Gbreve;": "\u011E", "&Gcedil;": "\u0122", "&Gcirc;": "\u011C", "&Gcy;": "\u0413", "&Gdot;": "\u0120", "&Gfr;": "\u{1D50A}", "&Gg;": "\u22D9", "&Gopf;": "\u{1D53E}", "&GreaterEqual;": "\u2265", "&GreaterEqualLess;": "\u22DB", "&GreaterFullEqual;": "\u2267", "&GreaterGreater;": "\u2AA2", "&GreaterLess;": "\u2277", "&GreaterSlantEqual;": "\u2A7E", "&GreaterTilde;": "\u2273", "&Gscr;": "\u{1D4A2}", "&Gt;": "\u226B", "&HARDcy;": "\u042A", "&Hacek;": "\u02C7", "&Hat;": "^", "&Hcirc;": "\u0124", "&Hfr;": "\u210C", "&HilbertSpace;": "\u210B", "&Hopf;": "\u210D", "&HorizontalLine;": "\u2500", "&Hscr;": "\u210B", "&Hstrok;": "\u0126", "&HumpDownHump;": "\u224E", "&HumpEqual;": "\u224F", "&IEcy;": "\u0415", "&IJlig;": "\u0132", "&IOcy;": "\u0401", "&Iacute": "\xCD", "&Iacute;": "\xCD", "&Icirc": "\xCE", "&Icirc;": "\xCE", "&Icy;": "\u0418", "&Idot;": "\u0130", "&Ifr;": "\u2111", "&Igrave": "\xCC", "&Igrave;": "\xCC", "&Im;": "\u2111", "&Imacr;": "\u012A", "&ImaginaryI;": "\u2148", "&Implies;": "\u21D2", "&Int;": "\u222C", "&Integral;": "\u222B", "&Intersection;": "\u22C2", "&InvisibleComma;": "\u2063", "&InvisibleTimes;": "\u2062", "&Iogon;": "\u012E", "&Iopf;": "\u{1D540}", "&Iota;": "\u0399", "&Iscr;": "\u2110", "&Itilde;": "\u0128", "&Iukcy;": "\u0406", "&Iuml": "\xCF", "&Iuml;": "\xCF", "&Jcirc;": "\u0134", "&Jcy;": "\u0419", "&Jfr;": "\u{1D50D}", "&Jopf;": "\u{1D541}", "&Jscr;": "\u{1D4A5}", "&Jsercy;": "\u0408", "&Jukcy;": "\u0404", "&KHcy;": "\u0425", "&KJcy;": "\u040C", "&Kappa;": "\u039A", "&Kcedil;": "\u0136", "&Kcy;": "\u041A", "&Kfr;": "\u{1D50E}", "&Kopf;": "\u{1D542}", "&Kscr;": "\u{1D4A6}", "&LJcy;": "\u0409", "&LT": "<", "&LT;": "<", "&Lacute;": "\u0139", "&Lambda;": "\u039B", "&Lang;": "\u27EA", "&Laplacetrf;": "\u2112", "&Larr;": "\u219E", "&Lcaron;": "\u013D", "&Lcedil;": "\u013B", "&Lcy;": "\u041B", "&LeftAngleBracket;": "\u27E8", "&LeftArrow;": "\u2190", "&LeftArrowBar;": "\u21E4", "&LeftArrowRightArrow;": "\u21C6", "&LeftCeiling;": "\u2308", "&LeftDoubleBracket;": "\u27E6", "&LeftDownTeeVector;": "\u2961", "&LeftDownVector;": "\u21C3", "&LeftDownVectorBar;": "\u2959", "&LeftFloor;": "\u230A", "&LeftRightArrow;": "\u2194", "&LeftRightVector;": "\u294E", "&LeftTee;": "\u22A3", "&LeftTeeArrow;": "\u21A4", "&LeftTeeVector;": "\u295A", "&LeftTriangle;": "\u22B2", "&LeftTriangleBar;": "\u29CF", "&LeftTriangleEqual;": "\u22B4", "&LeftUpDownVector;": "\u2951", "&LeftUpTeeVector;": "\u2960", "&LeftUpVector;": "\u21BF", "&LeftUpVectorBar;": "\u2958", "&LeftVector;": "\u21BC", "&LeftVectorBar;": "\u2952", "&Leftarrow;": "\u21D0", "&Leftrightarrow;": "\u21D4", "&LessEqualGreater;": "\u22DA", "&LessFullEqual;": "\u2266", "&LessGreater;": "\u2276", "&LessLess;": "\u2AA1", "&LessSlantEqual;": "\u2A7D", "&LessTilde;": "\u2272", "&Lfr;": "\u{1D50F}", "&Ll;": "\u22D8", "&Lleftarrow;": "\u21DA", "&Lmidot;": "\u013F", "&LongLeftArrow;": "\u27F5", "&LongLeftRightArrow;": "\u27F7", "&LongRightArrow;": "\u27F6", "&Longleftarrow;": "\u27F8", "&Longleftrightarrow;": "\u27FA", "&Longrightarrow;": "\u27F9", "&Lopf;": "\u{1D543}", "&LowerLeftArrow;": "\u2199", "&LowerRightArrow;": "\u2198", "&Lscr;": "\u2112", "&Lsh;": "\u21B0", "&Lstrok;": "\u0141", "&Lt;": "\u226A", "&Map;": "\u2905", "&Mcy;": "\u041C", "&MediumSpace;": "\u205F", "&Mellintrf;": "\u2133", "&Mfr;": "\u{1D510}", "&MinusPlus;": "\u2213", "&Mopf;": "\u{1D544}", "&Mscr;": "\u2133", "&Mu;": "\u039C", "&NJcy;": "\u040A", "&Nacute;": "\u0143", "&Ncaron;": "\u0147", "&Ncedil;": "\u0145", "&Ncy;": "\u041D", "&NegativeMediumSpace;": "\u200B", "&NegativeThickSpace;": "\u200B", "&NegativeThinSpace;": "\u200B", "&NegativeVeryThinSpace;": "\u200B", "&NestedGreaterGreater;": "\u226B", "&NestedLessLess;": "\u226A", "&NewLine;": "\n", "&Nfr;": "\u{1D511}", "&NoBreak;": "\u2060", "&NonBreakingSpace;": "\xA0", "&Nopf;": "\u2115", "&Not;": "\u2AEC", "&NotCongruent;": "\u2262", "&NotCupCap;": "\u226D", "&NotDoubleVerticalBar;": "\u2226", "&NotElement;": "\u2209", "&NotEqual;": "\u2260", "&NotEqualTilde;": "\u2242\u0338", "&NotExists;": "\u2204", "&NotGreater;": "\u226F", "&NotGreaterEqual;": "\u2271", "&NotGreaterFullEqual;": "\u2267\u0338", "&NotGreaterGreater;": "\u226B\u0338", "&NotGreaterLess;": "\u2279", "&NotGreaterSlantEqual;": "\u2A7E\u0338", "&NotGreaterTilde;": "\u2275", "&NotHumpDownHump;": "\u224E\u0338", "&NotHumpEqual;": "\u224F\u0338", "&NotLeftTriangle;": "\u22EA", "&NotLeftTriangleBar;": "\u29CF\u0338", "&NotLeftTriangleEqual;": "\u22EC", "&NotLess;": "\u226E", "&NotLessEqual;": "\u2270", "&NotLessGreater;": "\u2278", "&NotLessLess;": "\u226A\u0338", "&NotLessSlantEqual;": "\u2A7D\u0338", "&NotLessTilde;": "\u2274", "&NotNestedGreaterGreater;": "\u2AA2\u0338", "&NotNestedLessLess;": "\u2AA1\u0338", "&NotPrecedes;": "\u2280", "&NotPrecedesEqual;": "\u2AAF\u0338", "&NotPrecedesSlantEqual;": "\u22E0", "&NotReverseElement;": "\u220C", "&NotRightTriangle;": "\u22EB", "&NotRightTriangleBar;": "\u29D0\u0338", "&NotRightTriangleEqual;": "\u22ED", "&NotSquareSubset;": "\u228F\u0338", "&NotSquareSubsetEqual;": "\u22E2", "&NotSquareSuperset;": "\u2290\u0338", "&NotSquareSupersetEqual;": "\u22E3", "&NotSubset;": "\u2282\u20D2", "&NotSubsetEqual;": "\u2288", "&NotSucceeds;": "\u2281", "&NotSucceedsEqual;": "\u2AB0\u0338", "&NotSucceedsSlantEqual;": "\u22E1", "&NotSucceedsTilde;": "\u227F\u0338", "&NotSuperset;": "\u2283\u20D2", "&NotSupersetEqual;": "\u2289", "&NotTilde;": "\u2241", "&NotTildeEqual;": "\u2244", "&NotTildeFullEqual;": "\u2247", "&NotTildeTilde;": "\u2249", "&NotVerticalBar;": "\u2224", "&Nscr;": "\u{1D4A9}", "&Ntilde": "\xD1", "&Ntilde;": "\xD1", "&Nu;": "\u039D", "&OElig;": "\u0152", "&Oacute": "\xD3", "&Oacute;": "\xD3", "&Ocirc": "\xD4", "&Ocirc;": "\xD4", "&Ocy;": "\u041E", "&Odblac;": "\u0150", "&Ofr;": "\u{1D512}", "&Ograve": "\xD2", "&Ograve;": "\xD2", "&Omacr;": "\u014C", "&Omega;": "\u03A9", "&Omicron;": "\u039F", "&Oopf;": "\u{1D546}", "&OpenCurlyDoubleQuote;": "\u201C", "&OpenCurlyQuote;": "\u2018", "&Or;": "\u2A54", "&Oscr;": "\u{1D4AA}", "&Oslash": "\xD8", "&Oslash;": "\xD8", "&Otilde": "\xD5", "&Otilde;": "\xD5", "&Otimes;": "\u2A37", "&Ouml": "\xD6", "&Ouml;": "\xD6", "&OverBar;": "\u203E", "&OverBrace;": "\u23DE", "&OverBracket;": "\u23B4", "&OverParenthesis;": "\u23DC", "&PartialD;": "\u2202", "&Pcy;": "\u041F", "&Pfr;": "\u{1D513}", "&Phi;": "\u03A6", "&Pi;": "\u03A0", "&PlusMinus;": "\xB1", "&Poincareplane;": "\u210C", "&Popf;": "\u2119", "&Pr;": "\u2ABB", "&Precedes;": "\u227A", "&PrecedesEqual;": "\u2AAF", "&PrecedesSlantEqual;": "\u227C", "&PrecedesTilde;": "\u227E", "&Prime;": "\u2033", "&Product;": "\u220F", "&Proportion;": "\u2237", "&Proportional;": "\u221D", "&Pscr;": "\u{1D4AB}", "&Psi;": "\u03A8", "&QUOT": '"', "&QUOT;": '"', "&Qfr;": "\u{1D514}", "&Qopf;": "\u211A", "&Qscr;": "\u{1D4AC}", "&RBarr;": "\u2910", "&REG": "\xAE", "&REG;": "\xAE", "&Racute;": "\u0154", "&Rang;": "\u27EB", "&Rarr;": "\u21A0", "&Rarrtl;": "\u2916", "&Rcaron;": "\u0158", "&Rcedil;": "\u0156", "&Rcy;": "\u0420", "&Re;": "\u211C", "&ReverseElement;": "\u220B", "&ReverseEquilibrium;": "\u21CB", "&ReverseUpEquilibrium;": "\u296F", "&Rfr;": "\u211C", "&Rho;": "\u03A1", "&RightAngleBracket;": "\u27E9", "&RightArrow;": "\u2192", "&RightArrowBar;": "\u21E5", "&RightArrowLeftArrow;": "\u21C4", "&RightCeiling;": "\u2309", "&RightDoubleBracket;": "\u27E7", "&RightDownTeeVector;": "\u295D", "&RightDownVector;": "\u21C2", "&RightDownVectorBar;": "\u2955", "&RightFloor;": "\u230B", "&RightTee;": "\u22A2", "&RightTeeArrow;": "\u21A6", "&RightTeeVector;": "\u295B", "&RightTriangle;": "\u22B3", "&RightTriangleBar;": "\u29D0", "&RightTriangleEqual;": "\u22B5", "&RightUpDownVector;": "\u294F", "&RightUpTeeVector;": "\u295C", "&RightUpVector;": "\u21BE", "&RightUpVectorBar;": "\u2954", "&RightVector;": "\u21C0", "&RightVectorBar;": "\u2953", "&Rightarrow;": "\u21D2", "&Ropf;": "\u211D", "&RoundImplies;": "\u2970", "&Rrightarrow;": "\u21DB", "&Rscr;": "\u211B", "&Rsh;": "\u21B1", "&RuleDelayed;": "\u29F4", "&SHCHcy;": "\u0429", "&SHcy;": "\u0428", "&SOFTcy;": "\u042C", "&Sacute;": "\u015A", "&Sc;": "\u2ABC", "&Scaron;": "\u0160", "&Scedil;": "\u015E", "&Scirc;": "\u015C", "&Scy;": "\u0421", "&Sfr;": "\u{1D516}", "&ShortDownArrow;": "\u2193", "&ShortLeftArrow;": "\u2190", "&ShortRightArrow;": "\u2192", "&ShortUpArrow;": "\u2191", "&Sigma;": "\u03A3", "&SmallCircle;": "\u2218", "&Sopf;": "\u{1D54A}", "&Sqrt;": "\u221A", "&Square;": "\u25A1", "&SquareIntersection;": "\u2293", "&SquareSubset;": "\u228F", "&SquareSubsetEqual;": "\u2291", "&SquareSuperset;": "\u2290", "&SquareSupersetEqual;": "\u2292", "&SquareUnion;": "\u2294", "&Sscr;": "\u{1D4AE}", "&Star;": "\u22C6", "&Sub;": "\u22D0", "&Subset;": "\u22D0", "&SubsetEqual;": "\u2286", "&Succeeds;": "\u227B", "&SucceedsEqual;": "\u2AB0", "&SucceedsSlantEqual;": "\u227D", "&SucceedsTilde;": "\u227F", "&SuchThat;": "\u220B", "&Sum;": "\u2211", "&Sup;": "\u22D1", "&Superset;": "\u2283", "&SupersetEqual;": "\u2287", "&Supset;": "\u22D1", "&THORN": "\xDE", "&THORN;": "\xDE", "&TRADE;": "\u2122", "&TSHcy;": "\u040B", "&TScy;": "\u0426", "&Tab;": "	", "&Tau;": "\u03A4", "&Tcaron;": "\u0164", "&Tcedil;": "\u0162", "&Tcy;": "\u0422", "&Tfr;": "\u{1D517}", "&Therefore;": "\u2234", "&Theta;": "\u0398", "&ThickSpace;": "\u205F\u200A", "&ThinSpace;": "\u2009", "&Tilde;": "\u223C", "&TildeEqual;": "\u2243", "&TildeFullEqual;": "\u2245", "&TildeTilde;": "\u2248", "&Topf;": "\u{1D54B}", "&TripleDot;": "\u20DB", "&Tscr;": "\u{1D4AF}", "&Tstrok;": "\u0166", "&Uacute": "\xDA", "&Uacute;": "\xDA", "&Uarr;": "\u219F", "&Uarrocir;": "\u2949", "&Ubrcy;": "\u040E", "&Ubreve;": "\u016C", "&Ucirc": "\xDB", "&Ucirc;": "\xDB", "&Ucy;": "\u0423", "&Udblac;": "\u0170", "&Ufr;": "\u{1D518}", "&Ugrave": "\xD9", "&Ugrave;": "\xD9", "&Umacr;": "\u016A", "&UnderBar;": "_", "&UnderBrace;": "\u23DF", "&UnderBracket;": "\u23B5", "&UnderParenthesis;": "\u23DD", "&Union;": "\u22C3", "&UnionPlus;": "\u228E", "&Uogon;": "\u0172", "&Uopf;": "\u{1D54C}", "&UpArrow;": "\u2191", "&UpArrowBar;": "\u2912", "&UpArrowDownArrow;": "\u21C5", "&UpDownArrow;": "\u2195", "&UpEquilibrium;": "\u296E", "&UpTee;": "\u22A5", "&UpTeeArrow;": "\u21A5", "&Uparrow;": "\u21D1", "&Updownarrow;": "\u21D5", "&UpperLeftArrow;": "\u2196", "&UpperRightArrow;": "\u2197", "&Upsi;": "\u03D2", "&Upsilon;": "\u03A5", "&Uring;": "\u016E", "&Uscr;": "\u{1D4B0}", "&Utilde;": "\u0168", "&Uuml": "\xDC", "&Uuml;": "\xDC", "&VDash;": "\u22AB", "&Vbar;": "\u2AEB", "&Vcy;": "\u0412", "&Vdash;": "\u22A9", "&Vdashl;": "\u2AE6", "&Vee;": "\u22C1", "&Verbar;": "\u2016", "&Vert;": "\u2016", "&VerticalBar;": "\u2223", "&VerticalLine;": "|", "&VerticalSeparator;": "\u2758", "&VerticalTilde;": "\u2240", "&VeryThinSpace;": "\u200A", "&Vfr;": "\u{1D519}", "&Vopf;": "\u{1D54D}", "&Vscr;": "\u{1D4B1}", "&Vvdash;": "\u22AA", "&Wcirc;": "\u0174", "&Wedge;": "\u22C0", "&Wfr;": "\u{1D51A}", "&Wopf;": "\u{1D54E}", "&Wscr;": "\u{1D4B2}", "&Xfr;": "\u{1D51B}", "&Xi;": "\u039E", "&Xopf;": "\u{1D54F}", "&Xscr;": "\u{1D4B3}", "&YAcy;": "\u042F", "&YIcy;": "\u0407", "&YUcy;": "\u042E", "&Yacute": "\xDD", "&Yacute;": "\xDD", "&Ycirc;": "\u0176", "&Ycy;": "\u042B", "&Yfr;": "\u{1D51C}", "&Yopf;": "\u{1D550}", "&Yscr;": "\u{1D4B4}", "&Yuml;": "\u0178", "&ZHcy;": "\u0416", "&Zacute;": "\u0179", "&Zcaron;": "\u017D", "&Zcy;": "\u0417", "&Zdot;": "\u017B", "&ZeroWidthSpace;": "\u200B", "&Zeta;": "\u0396", "&Zfr;": "\u2128", "&Zopf;": "\u2124", "&Zscr;": "\u{1D4B5}", "&aacute": "\xE1", "&aacute;": "\xE1", "&abreve;": "\u0103", "&ac;": "\u223E", "&acE;": "\u223E\u0333", "&acd;": "\u223F", "&acirc": "\xE2", "&acirc;": "\xE2", "&acute": "\xB4", "&acute;": "\xB4", "&acy;": "\u0430", "&aelig": "\xE6", "&aelig;": "\xE6", "&af;": "\u2061", "&afr;": "\u{1D51E}", "&agrave": "\xE0", "&agrave;": "\xE0", "&alefsym;": "\u2135", "&aleph;": "\u2135", "&alpha;": "\u03B1", "&amacr;": "\u0101", "&amalg;": "\u2A3F", "&amp": "&", "&amp;": "&", "&and;": "\u2227", "&andand;": "\u2A55", "&andd;": "\u2A5C", "&andslope;": "\u2A58", "&andv;": "\u2A5A", "&ang;": "\u2220", "&ange;": "\u29A4", "&angle;": "\u2220", "&angmsd;": "\u2221", "&angmsdaa;": "\u29A8", "&angmsdab;": "\u29A9", "&angmsdac;": "\u29AA", "&angmsdad;": "\u29AB", "&angmsdae;": "\u29AC", "&angmsdaf;": "\u29AD", "&angmsdag;": "\u29AE", "&angmsdah;": "\u29AF", "&angrt;": "\u221F", "&angrtvb;": "\u22BE", "&angrtvbd;": "\u299D", "&angsph;": "\u2222", "&angst;": "\xC5", "&angzarr;": "\u237C", "&aogon;": "\u0105", "&aopf;": "\u{1D552}", "&ap;": "\u2248", "&apE;": "\u2A70", "&apacir;": "\u2A6F", "&ape;": "\u224A", "&apid;": "\u224B", "&apos;": "'", "&approx;": "\u2248", "&approxeq;": "\u224A", "&aring": "\xE5", "&aring;": "\xE5", "&ascr;": "\u{1D4B6}", "&ast;": "*", "&asymp;": "\u2248", "&asympeq;": "\u224D", "&atilde": "\xE3", "&atilde;": "\xE3", "&auml": "\xE4", "&auml;": "\xE4", "&awconint;": "\u2233", "&awint;": "\u2A11", "&bNot;": "\u2AED", "&backcong;": "\u224C", "&backepsilon;": "\u03F6", "&backprime;": "\u2035", "&backsim;": "\u223D", "&backsimeq;": "\u22CD", "&barvee;": "\u22BD", "&barwed;": "\u2305", "&barwedge;": "\u2305", "&bbrk;": "\u23B5", "&bbrktbrk;": "\u23B6", "&bcong;": "\u224C", "&bcy;": "\u0431", "&bdquo;": "\u201E", "&becaus;": "\u2235", "&because;": "\u2235", "&bemptyv;": "\u29B0", "&bepsi;": "\u03F6", "&bernou;": "\u212C", "&beta;": "\u03B2", "&beth;": "\u2136", "&between;": "\u226C", "&bfr;": "\u{1D51F}", "&bigcap;": "\u22C2", "&bigcirc;": "\u25EF", "&bigcup;": "\u22C3", "&bigodot;": "\u2A00", "&bigoplus;": "\u2A01", "&bigotimes;": "\u2A02", "&bigsqcup;": "\u2A06", "&bigstar;": "\u2605", "&bigtriangledown;": "\u25BD", "&bigtriangleup;": "\u25B3", "&biguplus;": "\u2A04", "&bigvee;": "\u22C1", "&bigwedge;": "\u22C0", "&bkarow;": "\u290D", "&blacklozenge;": "\u29EB", "&blacksquare;": "\u25AA", "&blacktriangle;": "\u25B4", "&blacktriangledown;": "\u25BE", "&blacktriangleleft;": "\u25C2", "&blacktriangleright;": "\u25B8", "&blank;": "\u2423", "&blk12;": "\u2592", "&blk14;": "\u2591", "&blk34;": "\u2593", "&block;": "\u2588", "&bne;": "=\u20E5", "&bnequiv;": "\u2261\u20E5", "&bnot;": "\u2310", "&bopf;": "\u{1D553}", "&bot;": "\u22A5", "&bottom;": "\u22A5", "&bowtie;": "\u22C8", "&boxDL;": "\u2557", "&boxDR;": "\u2554", "&boxDl;": "\u2556", "&boxDr;": "\u2553", "&boxH;": "\u2550", "&boxHD;": "\u2566", "&boxHU;": "\u2569", "&boxHd;": "\u2564", "&boxHu;": "\u2567", "&boxUL;": "\u255D", "&boxUR;": "\u255A", "&boxUl;": "\u255C", "&boxUr;": "\u2559", "&boxV;": "\u2551", "&boxVH;": "\u256C", "&boxVL;": "\u2563", "&boxVR;": "\u2560", "&boxVh;": "\u256B", "&boxVl;": "\u2562", "&boxVr;": "\u255F", "&boxbox;": "\u29C9", "&boxdL;": "\u2555", "&boxdR;": "\u2552", "&boxdl;": "\u2510", "&boxdr;": "\u250C", "&boxh;": "\u2500", "&boxhD;": "\u2565", "&boxhU;": "\u2568", "&boxhd;": "\u252C", "&boxhu;": "\u2534", "&boxminus;": "\u229F", "&boxplus;": "\u229E", "&boxtimes;": "\u22A0", "&boxuL;": "\u255B", "&boxuR;": "\u2558", "&boxul;": "\u2518", "&boxur;": "\u2514", "&boxv;": "\u2502", "&boxvH;": "\u256A", "&boxvL;": "\u2561", "&boxvR;": "\u255E", "&boxvh;": "\u253C", "&boxvl;": "\u2524", "&boxvr;": "\u251C", "&bprime;": "\u2035", "&breve;": "\u02D8", "&brvbar": "\xA6", "&brvbar;": "\xA6", "&bscr;": "\u{1D4B7}", "&bsemi;": "\u204F", "&bsim;": "\u223D", "&bsime;": "\u22CD", "&bsol;": "\\", "&bsolb;": "\u29C5", "&bsolhsub;": "\u27C8", "&bull;": "\u2022", "&bullet;": "\u2022", "&bump;": "\u224E", "&bumpE;": "\u2AAE", "&bumpe;": "\u224F", "&bumpeq;": "\u224F", "&cacute;": "\u0107", "&cap;": "\u2229", "&capand;": "\u2A44", "&capbrcup;": "\u2A49", "&capcap;": "\u2A4B", "&capcup;": "\u2A47", "&capdot;": "\u2A40", "&caps;": "\u2229\uFE00", "&caret;": "\u2041", "&caron;": "\u02C7", "&ccaps;": "\u2A4D", "&ccaron;": "\u010D", "&ccedil": "\xE7", "&ccedil;": "\xE7", "&ccirc;": "\u0109", "&ccups;": "\u2A4C", "&ccupssm;": "\u2A50", "&cdot;": "\u010B", "&cedil": "\xB8", "&cedil;": "\xB8", "&cemptyv;": "\u29B2", "&cent": "\xA2", "&cent;": "\xA2", "&centerdot;": "\xB7", "&cfr;": "\u{1D520}", "&chcy;": "\u0447", "&check;": "\u2713", "&checkmark;": "\u2713", "&chi;": "\u03C7", "&cir;": "\u25CB", "&cirE;": "\u29C3", "&circ;": "\u02C6", "&circeq;": "\u2257", "&circlearrowleft;": "\u21BA", "&circlearrowright;": "\u21BB", "&circledR;": "\xAE", "&circledS;": "\u24C8", "&circledast;": "\u229B", "&circledcirc;": "\u229A", "&circleddash;": "\u229D", "&cire;": "\u2257", "&cirfnint;": "\u2A10", "&cirmid;": "\u2AEF", "&cirscir;": "\u29C2", "&clubs;": "\u2663", "&clubsuit;": "\u2663", "&colon;": ":", "&colone;": "\u2254", "&coloneq;": "\u2254", "&comma;": ",", "&commat;": "@", "&comp;": "\u2201", "&compfn;": "\u2218", "&complement;": "\u2201", "&complexes;": "\u2102", "&cong;": "\u2245", "&congdot;": "\u2A6D", "&conint;": "\u222E", "&copf;": "\u{1D554}", "&coprod;": "\u2210", "&copy": "\xA9", "&copy;": "\xA9", "&copysr;": "\u2117", "&crarr;": "\u21B5", "&cross;": "\u2717", "&cscr;": "\u{1D4B8}", "&csub;": "\u2ACF", "&csube;": "\u2AD1", "&csup;": "\u2AD0", "&csupe;": "\u2AD2", "&ctdot;": "\u22EF", "&cudarrl;": "\u2938", "&cudarrr;": "\u2935", "&cuepr;": "\u22DE", "&cuesc;": "\u22DF", "&cularr;": "\u21B6", "&cularrp;": "\u293D", "&cup;": "\u222A", "&cupbrcap;": "\u2A48", "&cupcap;": "\u2A46", "&cupcup;": "\u2A4A", "&cupdot;": "\u228D", "&cupor;": "\u2A45", "&cups;": "\u222A\uFE00", "&curarr;": "\u21B7", "&curarrm;": "\u293C", "&curlyeqprec;": "\u22DE", "&curlyeqsucc;": "\u22DF", "&curlyvee;": "\u22CE", "&curlywedge;": "\u22CF", "&curren": "\xA4", "&curren;": "\xA4", "&curvearrowleft;": "\u21B6", "&curvearrowright;": "\u21B7", "&cuvee;": "\u22CE", "&cuwed;": "\u22CF", "&cwconint;": "\u2232", "&cwint;": "\u2231", "&cylcty;": "\u232D", "&dArr;": "\u21D3", "&dHar;": "\u2965", "&dagger;": "\u2020", "&daleth;": "\u2138", "&darr;": "\u2193", "&dash;": "\u2010", "&dashv;": "\u22A3", "&dbkarow;": "\u290F", "&dblac;": "\u02DD", "&dcaron;": "\u010F", "&dcy;": "\u0434", "&dd;": "\u2146", "&ddagger;": "\u2021", "&ddarr;": "\u21CA", "&ddotseq;": "\u2A77", "&deg": "\xB0", "&deg;": "\xB0", "&delta;": "\u03B4", "&demptyv;": "\u29B1", "&dfisht;": "\u297F", "&dfr;": "\u{1D521}", "&dharl;": "\u21C3", "&dharr;": "\u21C2", "&diam;": "\u22C4", "&diamond;": "\u22C4", "&diamondsuit;": "\u2666", "&diams;": "\u2666", "&die;": "\xA8", "&digamma;": "\u03DD", "&disin;": "\u22F2", "&div;": "\xF7", "&divide": "\xF7", "&divide;": "\xF7", "&divideontimes;": "\u22C7", "&divonx;": "\u22C7", "&djcy;": "\u0452", "&dlcorn;": "\u231E", "&dlcrop;": "\u230D", "&dollar;": "$", "&dopf;": "\u{1D555}", "&dot;": "\u02D9", "&doteq;": "\u2250", "&doteqdot;": "\u2251", "&dotminus;": "\u2238", "&dotplus;": "\u2214", "&dotsquare;": "\u22A1", "&doublebarwedge;": "\u2306", "&downarrow;": "\u2193", "&downdownarrows;": "\u21CA", "&downharpoonleft;": "\u21C3", "&downharpoonright;": "\u21C2", "&drbkarow;": "\u2910", "&drcorn;": "\u231F", "&drcrop;": "\u230C", "&dscr;": "\u{1D4B9}", "&dscy;": "\u0455", "&dsol;": "\u29F6", "&dstrok;": "\u0111", "&dtdot;": "\u22F1", "&dtri;": "\u25BF", "&dtrif;": "\u25BE", "&duarr;": "\u21F5", "&duhar;": "\u296F", "&dwangle;": "\u29A6", "&dzcy;": "\u045F", "&dzigrarr;": "\u27FF", "&eDDot;": "\u2A77", "&eDot;": "\u2251", "&eacute": "\xE9", "&eacute;": "\xE9", "&easter;": "\u2A6E", "&ecaron;": "\u011B", "&ecir;": "\u2256", "&ecirc": "\xEA", "&ecirc;": "\xEA", "&ecolon;": "\u2255", "&ecy;": "\u044D", "&edot;": "\u0117", "&ee;": "\u2147", "&efDot;": "\u2252", "&efr;": "\u{1D522}", "&eg;": "\u2A9A", "&egrave": "\xE8", "&egrave;": "\xE8", "&egs;": "\u2A96", "&egsdot;": "\u2A98", "&el;": "\u2A99", "&elinters;": "\u23E7", "&ell;": "\u2113", "&els;": "\u2A95", "&elsdot;": "\u2A97", "&emacr;": "\u0113", "&empty;": "\u2205", "&emptyset;": "\u2205", "&emptyv;": "\u2205", "&emsp13;": "\u2004", "&emsp14;": "\u2005", "&emsp;": "\u2003", "&eng;": "\u014B", "&ensp;": "\u2002", "&eogon;": "\u0119", "&eopf;": "\u{1D556}", "&epar;": "\u22D5", "&eparsl;": "\u29E3", "&eplus;": "\u2A71", "&epsi;": "\u03B5", "&epsilon;": "\u03B5", "&epsiv;": "\u03F5", "&eqcirc;": "\u2256", "&eqcolon;": "\u2255", "&eqsim;": "\u2242", "&eqslantgtr;": "\u2A96", "&eqslantless;": "\u2A95", "&equals;": "=", "&equest;": "\u225F", "&equiv;": "\u2261", "&equivDD;": "\u2A78", "&eqvparsl;": "\u29E5", "&erDot;": "\u2253", "&erarr;": "\u2971", "&escr;": "\u212F", "&esdot;": "\u2250", "&esim;": "\u2242", "&eta;": "\u03B7", "&eth": "\xF0", "&eth;": "\xF0", "&euml": "\xEB", "&euml;": "\xEB", "&euro;": "\u20AC", "&excl;": "!", "&exist;": "\u2203", "&expectation;": "\u2130", "&exponentiale;": "\u2147", "&fallingdotseq;": "\u2252", "&fcy;": "\u0444", "&female;": "\u2640", "&ffilig;": "\uFB03", "&fflig;": "\uFB00", "&ffllig;": "\uFB04", "&ffr;": "\u{1D523}", "&filig;": "\uFB01", "&fjlig;": "fj", "&flat;": "\u266D", "&fllig;": "\uFB02", "&fltns;": "\u25B1", "&fnof;": "\u0192", "&fopf;": "\u{1D557}", "&forall;": "\u2200", "&fork;": "\u22D4", "&forkv;": "\u2AD9", "&fpartint;": "\u2A0D", "&frac12": "\xBD", "&frac12;": "\xBD", "&frac13;": "\u2153", "&frac14": "\xBC", "&frac14;": "\xBC", "&frac15;": "\u2155", "&frac16;": "\u2159", "&frac18;": "\u215B", "&frac23;": "\u2154", "&frac25;": "\u2156", "&frac34": "\xBE", "&frac34;": "\xBE", "&frac35;": "\u2157", "&frac38;": "\u215C", "&frac45;": "\u2158", "&frac56;": "\u215A", "&frac58;": "\u215D", "&frac78;": "\u215E", "&frasl;": "\u2044", "&frown;": "\u2322", "&fscr;": "\u{1D4BB}", "&gE;": "\u2267", "&gEl;": "\u2A8C", "&gacute;": "\u01F5", "&gamma;": "\u03B3", "&gammad;": "\u03DD", "&gap;": "\u2A86", "&gbreve;": "\u011F", "&gcirc;": "\u011D", "&gcy;": "\u0433", "&gdot;": "\u0121", "&ge;": "\u2265", "&gel;": "\u22DB", "&geq;": "\u2265", "&geqq;": "\u2267", "&geqslant;": "\u2A7E", "&ges;": "\u2A7E", "&gescc;": "\u2AA9", "&gesdot;": "\u2A80", "&gesdoto;": "\u2A82", "&gesdotol;": "\u2A84", "&gesl;": "\u22DB\uFE00", "&gesles;": "\u2A94", "&gfr;": "\u{1D524}", "&gg;": "\u226B", "&ggg;": "\u22D9", "&gimel;": "\u2137", "&gjcy;": "\u0453", "&gl;": "\u2277", "&glE;": "\u2A92", "&gla;": "\u2AA5", "&glj;": "\u2AA4", "&gnE;": "\u2269", "&gnap;": "\u2A8A", "&gnapprox;": "\u2A8A", "&gne;": "\u2A88", "&gneq;": "\u2A88", "&gneqq;": "\u2269", "&gnsim;": "\u22E7", "&gopf;": "\u{1D558}", "&grave;": "`", "&gscr;": "\u210A", "&gsim;": "\u2273", "&gsime;": "\u2A8E", "&gsiml;": "\u2A90", "&gt": ">", "&gt;": ">", "&gtcc;": "\u2AA7", "&gtcir;": "\u2A7A", "&gtdot;": "\u22D7", "&gtlPar;": "\u2995", "&gtquest;": "\u2A7C", "&gtrapprox;": "\u2A86", "&gtrarr;": "\u2978", "&gtrdot;": "\u22D7", "&gtreqless;": "\u22DB", "&gtreqqless;": "\u2A8C", "&gtrless;": "\u2277", "&gtrsim;": "\u2273", "&gvertneqq;": "\u2269\uFE00", "&gvnE;": "\u2269\uFE00", "&hArr;": "\u21D4", "&hairsp;": "\u200A", "&half;": "\xBD", "&hamilt;": "\u210B", "&hardcy;": "\u044A", "&harr;": "\u2194", "&harrcir;": "\u2948", "&harrw;": "\u21AD", "&hbar;": "\u210F", "&hcirc;": "\u0125", "&hearts;": "\u2665", "&heartsuit;": "\u2665", "&hellip;": "\u2026", "&hercon;": "\u22B9", "&hfr;": "\u{1D525}", "&hksearow;": "\u2925", "&hkswarow;": "\u2926", "&hoarr;": "\u21FF", "&homtht;": "\u223B", "&hookleftarrow;": "\u21A9", "&hookrightarrow;": "\u21AA", "&hopf;": "\u{1D559}", "&horbar;": "\u2015", "&hscr;": "\u{1D4BD}", "&hslash;": "\u210F", "&hstrok;": "\u0127", "&hybull;": "\u2043", "&hyphen;": "\u2010", "&iacute": "\xED", "&iacute;": "\xED", "&ic;": "\u2063", "&icirc": "\xEE", "&icirc;": "\xEE", "&icy;": "\u0438", "&iecy;": "\u0435", "&iexcl": "\xA1", "&iexcl;": "\xA1", "&iff;": "\u21D4", "&ifr;": "\u{1D526}", "&igrave": "\xEC", "&igrave;": "\xEC", "&ii;": "\u2148", "&iiiint;": "\u2A0C", "&iiint;": "\u222D", "&iinfin;": "\u29DC", "&iiota;": "\u2129", "&ijlig;": "\u0133", "&imacr;": "\u012B", "&image;": "\u2111", "&imagline;": "\u2110", "&imagpart;": "\u2111", "&imath;": "\u0131", "&imof;": "\u22B7", "&imped;": "\u01B5", "&in;": "\u2208", "&incare;": "\u2105", "&infin;": "\u221E", "&infintie;": "\u29DD", "&inodot;": "\u0131", "&int;": "\u222B", "&intcal;": "\u22BA", "&integers;": "\u2124", "&intercal;": "\u22BA", "&intlarhk;": "\u2A17", "&intprod;": "\u2A3C", "&iocy;": "\u0451", "&iogon;": "\u012F", "&iopf;": "\u{1D55A}", "&iota;": "\u03B9", "&iprod;": "\u2A3C", "&iquest": "\xBF", "&iquest;": "\xBF", "&iscr;": "\u{1D4BE}", "&isin;": "\u2208", "&isinE;": "\u22F9", "&isindot;": "\u22F5", "&isins;": "\u22F4", "&isinsv;": "\u22F3", "&isinv;": "\u2208", "&it;": "\u2062", "&itilde;": "\u0129", "&iukcy;": "\u0456", "&iuml": "\xEF", "&iuml;": "\xEF", "&jcirc;": "\u0135", "&jcy;": "\u0439", "&jfr;": "\u{1D527}", "&jmath;": "\u0237", "&jopf;": "\u{1D55B}", "&jscr;": "\u{1D4BF}", "&jsercy;": "\u0458", "&jukcy;": "\u0454", "&kappa;": "\u03BA", "&kappav;": "\u03F0", "&kcedil;": "\u0137", "&kcy;": "\u043A", "&kfr;": "\u{1D528}", "&kgreen;": "\u0138", "&khcy;": "\u0445", "&kjcy;": "\u045C", "&kopf;": "\u{1D55C}", "&kscr;": "\u{1D4C0}", "&lAarr;": "\u21DA", "&lArr;": "\u21D0", "&lAtail;": "\u291B", "&lBarr;": "\u290E", "&lE;": "\u2266", "&lEg;": "\u2A8B", "&lHar;": "\u2962", "&lacute;": "\u013A", "&laemptyv;": "\u29B4", "&lagran;": "\u2112", "&lambda;": "\u03BB", "&lang;": "\u27E8", "&langd;": "\u2991", "&langle;": "\u27E8", "&lap;": "\u2A85", "&laquo": "\xAB", "&laquo;": "\xAB", "&larr;": "\u2190", "&larrb;": "\u21E4", "&larrbfs;": "\u291F", "&larrfs;": "\u291D", "&larrhk;": "\u21A9", "&larrlp;": "\u21AB", "&larrpl;": "\u2939", "&larrsim;": "\u2973", "&larrtl;": "\u21A2", "&lat;": "\u2AAB", "&latail;": "\u2919", "&late;": "\u2AAD", "&lates;": "\u2AAD\uFE00", "&lbarr;": "\u290C", "&lbbrk;": "\u2772", "&lbrace;": "{", "&lbrack;": "[", "&lbrke;": "\u298B", "&lbrksld;": "\u298F", "&lbrkslu;": "\u298D", "&lcaron;": "\u013E", "&lcedil;": "\u013C", "&lceil;": "\u2308", "&lcub;": "{", "&lcy;": "\u043B", "&ldca;": "\u2936", "&ldquo;": "\u201C", "&ldquor;": "\u201E", "&ldrdhar;": "\u2967", "&ldrushar;": "\u294B", "&ldsh;": "\u21B2", "&le;": "\u2264", "&leftarrow;": "\u2190", "&leftarrowtail;": "\u21A2", "&leftharpoondown;": "\u21BD", "&leftharpoonup;": "\u21BC", "&leftleftarrows;": "\u21C7", "&leftrightarrow;": "\u2194", "&leftrightarrows;": "\u21C6", "&leftrightharpoons;": "\u21CB", "&leftrightsquigarrow;": "\u21AD", "&leftthreetimes;": "\u22CB", "&leg;": "\u22DA", "&leq;": "\u2264", "&leqq;": "\u2266", "&leqslant;": "\u2A7D", "&les;": "\u2A7D", "&lescc;": "\u2AA8", "&lesdot;": "\u2A7F", "&lesdoto;": "\u2A81", "&lesdotor;": "\u2A83", "&lesg;": "\u22DA\uFE00", "&lesges;": "\u2A93", "&lessapprox;": "\u2A85", "&lessdot;": "\u22D6", "&lesseqgtr;": "\u22DA", "&lesseqqgtr;": "\u2A8B", "&lessgtr;": "\u2276", "&lesssim;": "\u2272", "&lfisht;": "\u297C", "&lfloor;": "\u230A", "&lfr;": "\u{1D529}", "&lg;": "\u2276", "&lgE;": "\u2A91", "&lhard;": "\u21BD", "&lharu;": "\u21BC", "&lharul;": "\u296A", "&lhblk;": "\u2584", "&ljcy;": "\u0459", "&ll;": "\u226A", "&llarr;": "\u21C7", "&llcorner;": "\u231E", "&llhard;": "\u296B", "&lltri;": "\u25FA", "&lmidot;": "\u0140", "&lmoust;": "\u23B0", "&lmoustache;": "\u23B0", "&lnE;": "\u2268", "&lnap;": "\u2A89", "&lnapprox;": "\u2A89", "&lne;": "\u2A87", "&lneq;": "\u2A87", "&lneqq;": "\u2268", "&lnsim;": "\u22E6", "&loang;": "\u27EC", "&loarr;": "\u21FD", "&lobrk;": "\u27E6", "&longleftarrow;": "\u27F5", "&longleftrightarrow;": "\u27F7", "&longmapsto;": "\u27FC", "&longrightarrow;": "\u27F6", "&looparrowleft;": "\u21AB", "&looparrowright;": "\u21AC", "&lopar;": "\u2985", "&lopf;": "\u{1D55D}", "&loplus;": "\u2A2D", "&lotimes;": "\u2A34", "&lowast;": "\u2217", "&lowbar;": "_", "&loz;": "\u25CA", "&lozenge;": "\u25CA", "&lozf;": "\u29EB", "&lpar;": "(", "&lparlt;": "\u2993", "&lrarr;": "\u21C6", "&lrcorner;": "\u231F", "&lrhar;": "\u21CB", "&lrhard;": "\u296D", "&lrm;": "\u200E", "&lrtri;": "\u22BF", "&lsaquo;": "\u2039", "&lscr;": "\u{1D4C1}", "&lsh;": "\u21B0", "&lsim;": "\u2272", "&lsime;": "\u2A8D", "&lsimg;": "\u2A8F", "&lsqb;": "[", "&lsquo;": "\u2018", "&lsquor;": "\u201A", "&lstrok;": "\u0142", "&lt": "<", "&lt;": "<", "&ltcc;": "\u2AA6", "&ltcir;": "\u2A79", "&ltdot;": "\u22D6", "&lthree;": "\u22CB", "&ltimes;": "\u22C9", "&ltlarr;": "\u2976", "&ltquest;": "\u2A7B", "&ltrPar;": "\u2996", "&ltri;": "\u25C3", "&ltrie;": "\u22B4", "&ltrif;": "\u25C2", "&lurdshar;": "\u294A", "&luruhar;": "\u2966", "&lvertneqq;": "\u2268\uFE00", "&lvnE;": "\u2268\uFE00", "&mDDot;": "\u223A", "&macr": "\xAF", "&macr;": "\xAF", "&male;": "\u2642", "&malt;": "\u2720", "&maltese;": "\u2720", "&map;": "\u21A6", "&mapsto;": "\u21A6", "&mapstodown;": "\u21A7", "&mapstoleft;": "\u21A4", "&mapstoup;": "\u21A5", "&marker;": "\u25AE", "&mcomma;": "\u2A29", "&mcy;": "\u043C", "&mdash;": "\u2014", "&measuredangle;": "\u2221", "&mfr;": "\u{1D52A}", "&mho;": "\u2127", "&micro": "\xB5", "&micro;": "\xB5", "&mid;": "\u2223", "&midast;": "*", "&midcir;": "\u2AF0", "&middot": "\xB7", "&middot;": "\xB7", "&minus;": "\u2212", "&minusb;": "\u229F", "&minusd;": "\u2238", "&minusdu;": "\u2A2A", "&mlcp;": "\u2ADB", "&mldr;": "\u2026", "&mnplus;": "\u2213", "&models;": "\u22A7", "&mopf;": "\u{1D55E}", "&mp;": "\u2213", "&mscr;": "\u{1D4C2}", "&mstpos;": "\u223E", "&mu;": "\u03BC", "&multimap;": "\u22B8", "&mumap;": "\u22B8", "&nGg;": "\u22D9\u0338", "&nGt;": "\u226B\u20D2", "&nGtv;": "\u226B\u0338", "&nLeftarrow;": "\u21CD", "&nLeftrightarrow;": "\u21CE", "&nLl;": "\u22D8\u0338", "&nLt;": "\u226A\u20D2", "&nLtv;": "\u226A\u0338", "&nRightarrow;": "\u21CF", "&nVDash;": "\u22AF", "&nVdash;": "\u22AE", "&nabla;": "\u2207", "&nacute;": "\u0144", "&nang;": "\u2220\u20D2", "&nap;": "\u2249", "&napE;": "\u2A70\u0338", "&napid;": "\u224B\u0338", "&napos;": "\u0149", "&napprox;": "\u2249", "&natur;": "\u266E", "&natural;": "\u266E", "&naturals;": "\u2115", "&nbsp": "\xA0", "&nbsp;": "\xA0", "&nbump;": "\u224E\u0338", "&nbumpe;": "\u224F\u0338", "&ncap;": "\u2A43", "&ncaron;": "\u0148", "&ncedil;": "\u0146", "&ncong;": "\u2247", "&ncongdot;": "\u2A6D\u0338", "&ncup;": "\u2A42", "&ncy;": "\u043D", "&ndash;": "\u2013", "&ne;": "\u2260", "&neArr;": "\u21D7", "&nearhk;": "\u2924", "&nearr;": "\u2197", "&nearrow;": "\u2197", "&nedot;": "\u2250\u0338", "&nequiv;": "\u2262", "&nesear;": "\u2928", "&nesim;": "\u2242\u0338", "&nexist;": "\u2204", "&nexists;": "\u2204", "&nfr;": "\u{1D52B}", "&ngE;": "\u2267\u0338", "&nge;": "\u2271", "&ngeq;": "\u2271", "&ngeqq;": "\u2267\u0338", "&ngeqslant;": "\u2A7E\u0338", "&nges;": "\u2A7E\u0338", "&ngsim;": "\u2275", "&ngt;": "\u226F", "&ngtr;": "\u226F", "&nhArr;": "\u21CE", "&nharr;": "\u21AE", "&nhpar;": "\u2AF2", "&ni;": "\u220B", "&nis;": "\u22FC", "&nisd;": "\u22FA", "&niv;": "\u220B", "&njcy;": "\u045A", "&nlArr;": "\u21CD", "&nlE;": "\u2266\u0338", "&nlarr;": "\u219A", "&nldr;": "\u2025", "&nle;": "\u2270", "&nleftarrow;": "\u219A", "&nleftrightarrow;": "\u21AE", "&nleq;": "\u2270", "&nleqq;": "\u2266\u0338", "&nleqslant;": "\u2A7D\u0338", "&nles;": "\u2A7D\u0338", "&nless;": "\u226E", "&nlsim;": "\u2274", "&nlt;": "\u226E", "&nltri;": "\u22EA", "&nltrie;": "\u22EC", "&nmid;": "\u2224", "&nopf;": "\u{1D55F}", "&not": "\xAC", "&not;": "\xAC", "&notin;": "\u2209", "&notinE;": "\u22F9\u0338", "&notindot;": "\u22F5\u0338", "&notinva;": "\u2209", "&notinvb;": "\u22F7", "&notinvc;": "\u22F6", "&notni;": "\u220C", "&notniva;": "\u220C", "&notnivb;": "\u22FE", "&notnivc;": "\u22FD", "&npar;": "\u2226", "&nparallel;": "\u2226", "&nparsl;": "\u2AFD\u20E5", "&npart;": "\u2202\u0338", "&npolint;": "\u2A14", "&npr;": "\u2280", "&nprcue;": "\u22E0", "&npre;": "\u2AAF\u0338", "&nprec;": "\u2280", "&npreceq;": "\u2AAF\u0338", "&nrArr;": "\u21CF", "&nrarr;": "\u219B", "&nrarrc;": "\u2933\u0338", "&nrarrw;": "\u219D\u0338", "&nrightarrow;": "\u219B", "&nrtri;": "\u22EB", "&nrtrie;": "\u22ED", "&nsc;": "\u2281", "&nsccue;": "\u22E1", "&nsce;": "\u2AB0\u0338", "&nscr;": "\u{1D4C3}", "&nshortmid;": "\u2224", "&nshortparallel;": "\u2226", "&nsim;": "\u2241", "&nsime;": "\u2244", "&nsimeq;": "\u2244", "&nsmid;": "\u2224", "&nspar;": "\u2226", "&nsqsube;": "\u22E2", "&nsqsupe;": "\u22E3", "&nsub;": "\u2284", "&nsubE;": "\u2AC5\u0338", "&nsube;": "\u2288", "&nsubset;": "\u2282\u20D2", "&nsubseteq;": "\u2288", "&nsubseteqq;": "\u2AC5\u0338", "&nsucc;": "\u2281", "&nsucceq;": "\u2AB0\u0338", "&nsup;": "\u2285", "&nsupE;": "\u2AC6\u0338", "&nsupe;": "\u2289", "&nsupset;": "\u2283\u20D2", "&nsupseteq;": "\u2289", "&nsupseteqq;": "\u2AC6\u0338", "&ntgl;": "\u2279", "&ntilde": "\xF1", "&ntilde;": "\xF1", "&ntlg;": "\u2278", "&ntriangleleft;": "\u22EA", "&ntrianglelefteq;": "\u22EC", "&ntriangleright;": "\u22EB", "&ntrianglerighteq;": "\u22ED", "&nu;": "\u03BD", "&num;": "#", "&numero;": "\u2116", "&numsp;": "\u2007", "&nvDash;": "\u22AD", "&nvHarr;": "\u2904", "&nvap;": "\u224D\u20D2", "&nvdash;": "\u22AC", "&nvge;": "\u2265\u20D2", "&nvgt;": ">\u20D2", "&nvinfin;": "\u29DE", "&nvlArr;": "\u2902", "&nvle;": "\u2264\u20D2", "&nvlt;": "<\u20D2", "&nvltrie;": "\u22B4\u20D2", "&nvrArr;": "\u2903", "&nvrtrie;": "\u22B5\u20D2", "&nvsim;": "\u223C\u20D2", "&nwArr;": "\u21D6", "&nwarhk;": "\u2923", "&nwarr;": "\u2196", "&nwarrow;": "\u2196", "&nwnear;": "\u2927", "&oS;": "\u24C8", "&oacute": "\xF3", "&oacute;": "\xF3", "&oast;": "\u229B", "&ocir;": "\u229A", "&ocirc": "\xF4", "&ocirc;": "\xF4", "&ocy;": "\u043E", "&odash;": "\u229D", "&odblac;": "\u0151", "&odiv;": "\u2A38", "&odot;": "\u2299", "&odsold;": "\u29BC", "&oelig;": "\u0153", "&ofcir;": "\u29BF", "&ofr;": "\u{1D52C}", "&ogon;": "\u02DB", "&ograve": "\xF2", "&ograve;": "\xF2", "&ogt;": "\u29C1", "&ohbar;": "\u29B5", "&ohm;": "\u03A9", "&oint;": "\u222E", "&olarr;": "\u21BA", "&olcir;": "\u29BE", "&olcross;": "\u29BB", "&oline;": "\u203E", "&olt;": "\u29C0", "&omacr;": "\u014D", "&omega;": "\u03C9", "&omicron;": "\u03BF", "&omid;": "\u29B6", "&ominus;": "\u2296", "&oopf;": "\u{1D560}", "&opar;": "\u29B7", "&operp;": "\u29B9", "&oplus;": "\u2295", "&or;": "\u2228", "&orarr;": "\u21BB", "&ord;": "\u2A5D", "&order;": "\u2134", "&orderof;": "\u2134", "&ordf": "\xAA", "&ordf;": "\xAA", "&ordm": "\xBA", "&ordm;": "\xBA", "&origof;": "\u22B6", "&oror;": "\u2A56", "&orslope;": "\u2A57", "&orv;": "\u2A5B", "&oscr;": "\u2134", "&oslash": "\xF8", "&oslash;": "\xF8", "&osol;": "\u2298", "&otilde": "\xF5", "&otilde;": "\xF5", "&otimes;": "\u2297", "&otimesas;": "\u2A36", "&ouml": "\xF6", "&ouml;": "\xF6", "&ovbar;": "\u233D", "&par;": "\u2225", "&para": "\xB6", "&para;": "\xB6", "&parallel;": "\u2225", "&parsim;": "\u2AF3", "&parsl;": "\u2AFD", "&part;": "\u2202", "&pcy;": "\u043F", "&percnt;": "%", "&period;": ".", "&permil;": "\u2030", "&perp;": "\u22A5", "&pertenk;": "\u2031", "&pfr;": "\u{1D52D}", "&phi;": "\u03C6", "&phiv;": "\u03D5", "&phmmat;": "\u2133", "&phone;": "\u260E", "&pi;": "\u03C0", "&pitchfork;": "\u22D4", "&piv;": "\u03D6", "&planck;": "\u210F", "&planckh;": "\u210E", "&plankv;": "\u210F", "&plus;": "+", "&plusacir;": "\u2A23", "&plusb;": "\u229E", "&pluscir;": "\u2A22", "&plusdo;": "\u2214", "&plusdu;": "\u2A25", "&pluse;": "\u2A72", "&plusmn": "\xB1", "&plusmn;": "\xB1", "&plussim;": "\u2A26", "&plustwo;": "\u2A27", "&pm;": "\xB1", "&pointint;": "\u2A15", "&popf;": "\u{1D561}", "&pound": "\xA3", "&pound;": "\xA3", "&pr;": "\u227A", "&prE;": "\u2AB3", "&prap;": "\u2AB7", "&prcue;": "\u227C", "&pre;": "\u2AAF", "&prec;": "\u227A", "&precapprox;": "\u2AB7", "&preccurlyeq;": "\u227C", "&preceq;": "\u2AAF", "&precnapprox;": "\u2AB9", "&precneqq;": "\u2AB5", "&precnsim;": "\u22E8", "&precsim;": "\u227E", "&prime;": "\u2032", "&primes;": "\u2119", "&prnE;": "\u2AB5", "&prnap;": "\u2AB9", "&prnsim;": "\u22E8", "&prod;": "\u220F", "&profalar;": "\u232E", "&profline;": "\u2312", "&profsurf;": "\u2313", "&prop;": "\u221D", "&propto;": "\u221D", "&prsim;": "\u227E", "&prurel;": "\u22B0", "&pscr;": "\u{1D4C5}", "&psi;": "\u03C8", "&puncsp;": "\u2008", "&qfr;": "\u{1D52E}", "&qint;": "\u2A0C", "&qopf;": "\u{1D562}", "&qprime;": "\u2057", "&qscr;": "\u{1D4C6}", "&quaternions;": "\u210D", "&quatint;": "\u2A16", "&quest;": "?", "&questeq;": "\u225F", "&quot": '"', "&quot;": '"', "&rAarr;": "\u21DB", "&rArr;": "\u21D2", "&rAtail;": "\u291C", "&rBarr;": "\u290F", "&rHar;": "\u2964", "&race;": "\u223D\u0331", "&racute;": "\u0155", "&radic;": "\u221A", "&raemptyv;": "\u29B3", "&rang;": "\u27E9", "&rangd;": "\u2992", "&range;": "\u29A5", "&rangle;": "\u27E9", "&raquo": "\xBB", "&raquo;": "\xBB", "&rarr;": "\u2192", "&rarrap;": "\u2975", "&rarrb;": "\u21E5", "&rarrbfs;": "\u2920", "&rarrc;": "\u2933", "&rarrfs;": "\u291E", "&rarrhk;": "\u21AA", "&rarrlp;": "\u21AC", "&rarrpl;": "\u2945", "&rarrsim;": "\u2974", "&rarrtl;": "\u21A3", "&rarrw;": "\u219D", "&ratail;": "\u291A", "&ratio;": "\u2236", "&rationals;": "\u211A", "&rbarr;": "\u290D", "&rbbrk;": "\u2773", "&rbrace;": "}", "&rbrack;": "]", "&rbrke;": "\u298C", "&rbrksld;": "\u298E", "&rbrkslu;": "\u2990", "&rcaron;": "\u0159", "&rcedil;": "\u0157", "&rceil;": "\u2309", "&rcub;": "}", "&rcy;": "\u0440", "&rdca;": "\u2937", "&rdldhar;": "\u2969", "&rdquo;": "\u201D", "&rdquor;": "\u201D", "&rdsh;": "\u21B3", "&real;": "\u211C", "&realine;": "\u211B", "&realpart;": "\u211C", "&reals;": "\u211D", "&rect;": "\u25AD", "&reg": "\xAE", "&reg;": "\xAE", "&rfisht;": "\u297D", "&rfloor;": "\u230B", "&rfr;": "\u{1D52F}", "&rhard;": "\u21C1", "&rharu;": "\u21C0", "&rharul;": "\u296C", "&rho;": "\u03C1", "&rhov;": "\u03F1", "&rightarrow;": "\u2192", "&rightarrowtail;": "\u21A3", "&rightharpoondown;": "\u21C1", "&rightharpoonup;": "\u21C0", "&rightleftarrows;": "\u21C4", "&rightleftharpoons;": "\u21CC", "&rightrightarrows;": "\u21C9", "&rightsquigarrow;": "\u219D", "&rightthreetimes;": "\u22CC", "&ring;": "\u02DA", "&risingdotseq;": "\u2253", "&rlarr;": "\u21C4", "&rlhar;": "\u21CC", "&rlm;": "\u200F", "&rmoust;": "\u23B1", "&rmoustache;": "\u23B1", "&rnmid;": "\u2AEE", "&roang;": "\u27ED", "&roarr;": "\u21FE", "&robrk;": "\u27E7", "&ropar;": "\u2986", "&ropf;": "\u{1D563}", "&roplus;": "\u2A2E", "&rotimes;": "\u2A35", "&rpar;": ")", "&rpargt;": "\u2994", "&rppolint;": "\u2A12", "&rrarr;": "\u21C9", "&rsaquo;": "\u203A", "&rscr;": "\u{1D4C7}", "&rsh;": "\u21B1", "&rsqb;": "]", "&rsquo;": "\u2019", "&rsquor;": "\u2019", "&rthree;": "\u22CC", "&rtimes;": "\u22CA", "&rtri;": "\u25B9", "&rtrie;": "\u22B5", "&rtrif;": "\u25B8", "&rtriltri;": "\u29CE", "&ruluhar;": "\u2968", "&rx;": "\u211E", "&sacute;": "\u015B", "&sbquo;": "\u201A", "&sc;": "\u227B", "&scE;": "\u2AB4", "&scap;": "\u2AB8", "&scaron;": "\u0161", "&sccue;": "\u227D", "&sce;": "\u2AB0", "&scedil;": "\u015F", "&scirc;": "\u015D", "&scnE;": "\u2AB6", "&scnap;": "\u2ABA", "&scnsim;": "\u22E9", "&scpolint;": "\u2A13", "&scsim;": "\u227F", "&scy;": "\u0441", "&sdot;": "\u22C5", "&sdotb;": "\u22A1", "&sdote;": "\u2A66", "&seArr;": "\u21D8", "&searhk;": "\u2925", "&searr;": "\u2198", "&searrow;": "\u2198", "&sect": "\xA7", "&sect;": "\xA7", "&semi;": ";", "&seswar;": "\u2929", "&setminus;": "\u2216", "&setmn;": "\u2216", "&sext;": "\u2736", "&sfr;": "\u{1D530}", "&sfrown;": "\u2322", "&sharp;": "\u266F", "&shchcy;": "\u0449", "&shcy;": "\u0448", "&shortmid;": "\u2223", "&shortparallel;": "\u2225", "&shy": "\xAD", "&shy;": "\xAD", "&sigma;": "\u03C3", "&sigmaf;": "\u03C2", "&sigmav;": "\u03C2", "&sim;": "\u223C", "&simdot;": "\u2A6A", "&sime;": "\u2243", "&simeq;": "\u2243", "&simg;": "\u2A9E", "&simgE;": "\u2AA0", "&siml;": "\u2A9D", "&simlE;": "\u2A9F", "&simne;": "\u2246", "&simplus;": "\u2A24", "&simrarr;": "\u2972", "&slarr;": "\u2190", "&smallsetminus;": "\u2216", "&smashp;": "\u2A33", "&smeparsl;": "\u29E4", "&smid;": "\u2223", "&smile;": "\u2323", "&smt;": "\u2AAA", "&smte;": "\u2AAC", "&smtes;": "\u2AAC\uFE00", "&softcy;": "\u044C", "&sol;": "/", "&solb;": "\u29C4", "&solbar;": "\u233F", "&sopf;": "\u{1D564}", "&spades;": "\u2660", "&spadesuit;": "\u2660", "&spar;": "\u2225", "&sqcap;": "\u2293", "&sqcaps;": "\u2293\uFE00", "&sqcup;": "\u2294", "&sqcups;": "\u2294\uFE00", "&sqsub;": "\u228F", "&sqsube;": "\u2291", "&sqsubset;": "\u228F", "&sqsubseteq;": "\u2291", "&sqsup;": "\u2290", "&sqsupe;": "\u2292", "&sqsupset;": "\u2290", "&sqsupseteq;": "\u2292", "&squ;": "\u25A1", "&square;": "\u25A1", "&squarf;": "\u25AA", "&squf;": "\u25AA", "&srarr;": "\u2192", "&sscr;": "\u{1D4C8}", "&ssetmn;": "\u2216", "&ssmile;": "\u2323", "&sstarf;": "\u22C6", "&star;": "\u2606", "&starf;": "\u2605", "&straightepsilon;": "\u03F5", "&straightphi;": "\u03D5", "&strns;": "\xAF", "&sub;": "\u2282", "&subE;": "\u2AC5", "&subdot;": "\u2ABD", "&sube;": "\u2286", "&subedot;": "\u2AC3", "&submult;": "\u2AC1", "&subnE;": "\u2ACB", "&subne;": "\u228A", "&subplus;": "\u2ABF", "&subrarr;": "\u2979", "&subset;": "\u2282", "&subseteq;": "\u2286", "&subseteqq;": "\u2AC5", "&subsetneq;": "\u228A", "&subsetneqq;": "\u2ACB", "&subsim;": "\u2AC7", "&subsub;": "\u2AD5", "&subsup;": "\u2AD3", "&succ;": "\u227B", "&succapprox;": "\u2AB8", "&succcurlyeq;": "\u227D", "&succeq;": "\u2AB0", "&succnapprox;": "\u2ABA", "&succneqq;": "\u2AB6", "&succnsim;": "\u22E9", "&succsim;": "\u227F", "&sum;": "\u2211", "&sung;": "\u266A", "&sup1": "\xB9", "&sup1;": "\xB9", "&sup2": "\xB2", "&sup2;": "\xB2", "&sup3": "\xB3", "&sup3;": "\xB3", "&sup;": "\u2283", "&supE;": "\u2AC6", "&supdot;": "\u2ABE", "&supdsub;": "\u2AD8", "&supe;": "\u2287", "&supedot;": "\u2AC4", "&suphsol;": "\u27C9", "&suphsub;": "\u2AD7", "&suplarr;": "\u297B", "&supmult;": "\u2AC2", "&supnE;": "\u2ACC", "&supne;": "\u228B", "&supplus;": "\u2AC0", "&supset;": "\u2283", "&supseteq;": "\u2287", "&supseteqq;": "\u2AC6", "&supsetneq;": "\u228B", "&supsetneqq;": "\u2ACC", "&supsim;": "\u2AC8", "&supsub;": "\u2AD4", "&supsup;": "\u2AD6", "&swArr;": "\u21D9", "&swarhk;": "\u2926", "&swarr;": "\u2199", "&swarrow;": "\u2199", "&swnwar;": "\u292A", "&szlig": "\xDF", "&szlig;": "\xDF", "&target;": "\u2316", "&tau;": "\u03C4", "&tbrk;": "\u23B4", "&tcaron;": "\u0165", "&tcedil;": "\u0163", "&tcy;": "\u0442", "&tdot;": "\u20DB", "&telrec;": "\u2315", "&tfr;": "\u{1D531}", "&there4;": "\u2234", "&therefore;": "\u2234", "&theta;": "\u03B8", "&thetasym;": "\u03D1", "&thetav;": "\u03D1", "&thickapprox;": "\u2248", "&thicksim;": "\u223C", "&thinsp;": "\u2009", "&thkap;": "\u2248", "&thksim;": "\u223C", "&thorn": "\xFE", "&thorn;": "\xFE", "&tilde;": "\u02DC", "&times": "\xD7", "&times;": "\xD7", "&timesb;": "\u22A0", "&timesbar;": "\u2A31", "&timesd;": "\u2A30", "&tint;": "\u222D", "&toea;": "\u2928", "&top;": "\u22A4", "&topbot;": "\u2336", "&topcir;": "\u2AF1", "&topf;": "\u{1D565}", "&topfork;": "\u2ADA", "&tosa;": "\u2929", "&tprime;": "\u2034", "&trade;": "\u2122", "&triangle;": "\u25B5", "&triangledown;": "\u25BF", "&triangleleft;": "\u25C3", "&trianglelefteq;": "\u22B4", "&triangleq;": "\u225C", "&triangleright;": "\u25B9", "&trianglerighteq;": "\u22B5", "&tridot;": "\u25EC", "&trie;": "\u225C", "&triminus;": "\u2A3A", "&triplus;": "\u2A39", "&trisb;": "\u29CD", "&tritime;": "\u2A3B", "&trpezium;": "\u23E2", "&tscr;": "\u{1D4C9}", "&tscy;": "\u0446", "&tshcy;": "\u045B", "&tstrok;": "\u0167", "&twixt;": "\u226C", "&twoheadleftarrow;": "\u219E", "&twoheadrightarrow;": "\u21A0", "&uArr;": "\u21D1", "&uHar;": "\u2963", "&uacute": "\xFA", "&uacute;": "\xFA", "&uarr;": "\u2191", "&ubrcy;": "\u045E", "&ubreve;": "\u016D", "&ucirc": "\xFB", "&ucirc;": "\xFB", "&ucy;": "\u0443", "&udarr;": "\u21C5", "&udblac;": "\u0171", "&udhar;": "\u296E", "&ufisht;": "\u297E", "&ufr;": "\u{1D532}", "&ugrave": "\xF9", "&ugrave;": "\xF9", "&uharl;": "\u21BF", "&uharr;": "\u21BE", "&uhblk;": "\u2580", "&ulcorn;": "\u231C", "&ulcorner;": "\u231C", "&ulcrop;": "\u230F", "&ultri;": "\u25F8", "&umacr;": "\u016B", "&uml": "\xA8", "&uml;": "\xA8", "&uogon;": "\u0173", "&uopf;": "\u{1D566}", "&uparrow;": "\u2191", "&updownarrow;": "\u2195", "&upharpoonleft;": "\u21BF", "&upharpoonright;": "\u21BE", "&uplus;": "\u228E", "&upsi;": "\u03C5", "&upsih;": "\u03D2", "&upsilon;": "\u03C5", "&upuparrows;": "\u21C8", "&urcorn;": "\u231D", "&urcorner;": "\u231D", "&urcrop;": "\u230E", "&uring;": "\u016F", "&urtri;": "\u25F9", "&uscr;": "\u{1D4CA}", "&utdot;": "\u22F0", "&utilde;": "\u0169", "&utri;": "\u25B5", "&utrif;": "\u25B4", "&uuarr;": "\u21C8", "&uuml": "\xFC", "&uuml;": "\xFC", "&uwangle;": "\u29A7", "&vArr;": "\u21D5", "&vBar;": "\u2AE8", "&vBarv;": "\u2AE9", "&vDash;": "\u22A8", "&vangrt;": "\u299C", "&varepsilon;": "\u03F5", "&varkappa;": "\u03F0", "&varnothing;": "\u2205", "&varphi;": "\u03D5", "&varpi;": "\u03D6", "&varpropto;": "\u221D", "&varr;": "\u2195", "&varrho;": "\u03F1", "&varsigma;": "\u03C2", "&varsubsetneq;": "\u228A\uFE00", "&varsubsetneqq;": "\u2ACB\uFE00", "&varsupsetneq;": "\u228B\uFE00", "&varsupsetneqq;": "\u2ACC\uFE00", "&vartheta;": "\u03D1", "&vartriangleleft;": "\u22B2", "&vartriangleright;": "\u22B3", "&vcy;": "\u0432", "&vdash;": "\u22A2", "&vee;": "\u2228", "&veebar;": "\u22BB", "&veeeq;": "\u225A", "&vellip;": "\u22EE", "&verbar;": "|", "&vert;": "|", "&vfr;": "\u{1D533}", "&vltri;": "\u22B2", "&vnsub;": "\u2282\u20D2", "&vnsup;": "\u2283\u20D2", "&vopf;": "\u{1D567}", "&vprop;": "\u221D", "&vrtri;": "\u22B3", "&vscr;": "\u{1D4CB}", "&vsubnE;": "\u2ACB\uFE00", "&vsubne;": "\u228A\uFE00", "&vsupnE;": "\u2ACC\uFE00", "&vsupne;": "\u228B\uFE00", "&vzigzag;": "\u299A", "&wcirc;": "\u0175", "&wedbar;": "\u2A5F", "&wedge;": "\u2227", "&wedgeq;": "\u2259", "&weierp;": "\u2118", "&wfr;": "\u{1D534}", "&wopf;": "\u{1D568}", "&wp;": "\u2118", "&wr;": "\u2240", "&wreath;": "\u2240", "&wscr;": "\u{1D4CC}", "&xcap;": "\u22C2", "&xcirc;": "\u25EF", "&xcup;": "\u22C3", "&xdtri;": "\u25BD", "&xfr;": "\u{1D535}", "&xhArr;": "\u27FA", "&xharr;": "\u27F7", "&xi;": "\u03BE", "&xlArr;": "\u27F8", "&xlarr;": "\u27F5", "&xmap;": "\u27FC", "&xnis;": "\u22FB", "&xodot;": "\u2A00", "&xopf;": "\u{1D569}", "&xoplus;": "\u2A01", "&xotime;": "\u2A02", "&xrArr;": "\u27F9", "&xrarr;": "\u27F6", "&xscr;": "\u{1D4CD}", "&xsqcup;": "\u2A06", "&xuplus;": "\u2A04", "&xutri;": "\u25B3", "&xvee;": "\u22C1", "&xwedge;": "\u22C0", "&yacute": "\xFD", "&yacute;": "\xFD", "&yacy;": "\u044F", "&ycirc;": "\u0177", "&ycy;": "\u044B", "&yen": "\xA5", "&yen;": "\xA5", "&yfr;": "\u{1D536}", "&yicy;": "\u0457", "&yopf;": "\u{1D56A}", "&yscr;": "\u{1D4CE}", "&yucy;": "\u044E", "&yuml": "\xFF", "&yuml;": "\xFF", "&zacute;": "\u017A", "&zcaron;": "\u017E", "&zcy;": "\u0437", "&zdot;": "\u017C", "&zeetrf;": "\u2128", "&zeta;": "\u03B6", "&zfr;": "\u{1D537}", "&zhcy;": "\u0436", "&zigrarr;": "\u21DD", "&zopf;": "\u{1D56B}", "&zscr;": "\u{1D4CF}", "&zwj;": "\u200D", "&zwnj;": "\u200C" }, characters: { "\xC6": "&AElig;", "&": "&amp;", "\xC1": "&Aacute;", "\u0102": "&Abreve;", "\xC2": "&Acirc;", "\u0410": "&Acy;", "\u{1D504}": "&Afr;", "\xC0": "&Agrave;", "\u0391": "&Alpha;", "\u0100": "&Amacr;", "\u2A53": "&And;", "\u0104": "&Aogon;", "\u{1D538}": "&Aopf;", "\u2061": "&af;", "\xC5": "&angst;", "\u{1D49C}": "&Ascr;", "\u2254": "&coloneq;", "\xC3": "&Atilde;", "\xC4": "&Auml;", "\u2216": "&ssetmn;", "\u2AE7": "&Barv;", "\u2306": "&doublebarwedge;", "\u0411": "&Bcy;", "\u2235": "&because;", "\u212C": "&bernou;", "\u0392": "&Beta;", "\u{1D505}": "&Bfr;", "\u{1D539}": "&Bopf;", "\u02D8": "&breve;", "\u224E": "&bump;", "\u0427": "&CHcy;", "\xA9": "&copy;", "\u0106": "&Cacute;", "\u22D2": "&Cap;", "\u2145": "&DD;", "\u212D": "&Cfr;", "\u010C": "&Ccaron;", "\xC7": "&Ccedil;", "\u0108": "&Ccirc;", "\u2230": "&Cconint;", "\u010A": "&Cdot;", "\xB8": "&cedil;", "\xB7": "&middot;", "\u03A7": "&Chi;", "\u2299": "&odot;", "\u2296": "&ominus;", "\u2295": "&oplus;", "\u2297": "&otimes;", "\u2232": "&cwconint;", "\u201D": "&rdquor;", "\u2019": "&rsquor;", "\u2237": "&Proportion;", "\u2A74": "&Colone;", "\u2261": "&equiv;", "\u222F": "&DoubleContourIntegral;", "\u222E": "&oint;", "\u2102": "&complexes;", "\u2210": "&coprod;", "\u2233": "&awconint;", "\u2A2F": "&Cross;", "\u{1D49E}": "&Cscr;", "\u22D3": "&Cup;", "\u224D": "&asympeq;", "\u2911": "&DDotrahd;", "\u0402": "&DJcy;", "\u0405": "&DScy;", "\u040F": "&DZcy;", "\u2021": "&ddagger;", "\u21A1": "&Darr;", "\u2AE4": "&DoubleLeftTee;", "\u010E": "&Dcaron;", "\u0414": "&Dcy;", "\u2207": "&nabla;", "\u0394": "&Delta;", "\u{1D507}": "&Dfr;", "\xB4": "&acute;", "\u02D9": "&dot;", "\u02DD": "&dblac;", "`": "&grave;", "\u02DC": "&tilde;", "\u22C4": "&diamond;", "\u2146": "&dd;", "\u{1D53B}": "&Dopf;", "\xA8": "&uml;", "\u20DC": "&DotDot;", "\u2250": "&esdot;", "\u21D3": "&dArr;", "\u21D0": "&lArr;", "\u21D4": "&iff;", "\u27F8": "&xlArr;", "\u27FA": "&xhArr;", "\u27F9": "&xrArr;", "\u21D2": "&rArr;", "\u22A8": "&vDash;", "\u21D1": "&uArr;", "\u21D5": "&vArr;", "\u2225": "&spar;", "\u2193": "&downarrow;", "\u2913": "&DownArrowBar;", "\u21F5": "&duarr;", "\u0311": "&DownBreve;", "\u2950": "&DownLeftRightVector;", "\u295E": "&DownLeftTeeVector;", "\u21BD": "&lhard;", "\u2956": "&DownLeftVectorBar;", "\u295F": "&DownRightTeeVector;", "\u21C1": "&rightharpoondown;", "\u2957": "&DownRightVectorBar;", "\u22A4": "&top;", "\u21A7": "&mapstodown;", "\u{1D49F}": "&Dscr;", "\u0110": "&Dstrok;", "\u014A": "&ENG;", "\xD0": "&ETH;", "\xC9": "&Eacute;", "\u011A": "&Ecaron;", "\xCA": "&Ecirc;", "\u042D": "&Ecy;", "\u0116": "&Edot;", "\u{1D508}": "&Efr;", "\xC8": "&Egrave;", "\u2208": "&isinv;", "\u0112": "&Emacr;", "\u25FB": "&EmptySmallSquare;", "\u25AB": "&EmptyVerySmallSquare;", "\u0118": "&Eogon;", "\u{1D53C}": "&Eopf;", "\u0395": "&Epsilon;", "\u2A75": "&Equal;", "\u2242": "&esim;", "\u21CC": "&rlhar;", "\u2130": "&expectation;", "\u2A73": "&Esim;", "\u0397": "&Eta;", "\xCB": "&Euml;", "\u2203": "&exist;", "\u2147": "&exponentiale;", "\u0424": "&Fcy;", "\u{1D509}": "&Ffr;", "\u25FC": "&FilledSmallSquare;", "\u25AA": "&squf;", "\u{1D53D}": "&Fopf;", "\u2200": "&forall;", "\u2131": "&Fscr;", "\u0403": "&GJcy;", ">": "&gt;", "\u0393": "&Gamma;", "\u03DC": "&Gammad;", "\u011E": "&Gbreve;", "\u0122": "&Gcedil;", "\u011C": "&Gcirc;", "\u0413": "&Gcy;", "\u0120": "&Gdot;", "\u{1D50A}": "&Gfr;", "\u22D9": "&ggg;", "\u{1D53E}": "&Gopf;", "\u2265": "&geq;", "\u22DB": "&gtreqless;", "\u2267": "&geqq;", "\u2AA2": "&GreaterGreater;", "\u2277": "&gtrless;", "\u2A7E": "&ges;", "\u2273": "&gtrsim;", "\u{1D4A2}": "&Gscr;", "\u226B": "&gg;", "\u042A": "&HARDcy;", "\u02C7": "&caron;", "^": "&Hat;", "\u0124": "&Hcirc;", "\u210C": "&Poincareplane;", "\u210B": "&hamilt;", "\u210D": "&quaternions;", "\u2500": "&boxh;", "\u0126": "&Hstrok;", "\u224F": "&bumpeq;", "\u0415": "&IEcy;", "\u0132": "&IJlig;", "\u0401": "&IOcy;", "\xCD": "&Iacute;", "\xCE": "&Icirc;", "\u0418": "&Icy;", "\u0130": "&Idot;", "\u2111": "&imagpart;", "\xCC": "&Igrave;", "\u012A": "&Imacr;", "\u2148": "&ii;", "\u222C": "&Int;", "\u222B": "&int;", "\u22C2": "&xcap;", "\u2063": "&ic;", "\u2062": "&it;", "\u012E": "&Iogon;", "\u{1D540}": "&Iopf;", "\u0399": "&Iota;", "\u2110": "&imagline;", "\u0128": "&Itilde;", "\u0406": "&Iukcy;", "\xCF": "&Iuml;", "\u0134": "&Jcirc;", "\u0419": "&Jcy;", "\u{1D50D}": "&Jfr;", "\u{1D541}": "&Jopf;", "\u{1D4A5}": "&Jscr;", "\u0408": "&Jsercy;", "\u0404": "&Jukcy;", "\u0425": "&KHcy;", "\u040C": "&KJcy;", "\u039A": "&Kappa;", "\u0136": "&Kcedil;", "\u041A": "&Kcy;", "\u{1D50E}": "&Kfr;", "\u{1D542}": "&Kopf;", "\u{1D4A6}": "&Kscr;", "\u0409": "&LJcy;", "<": "&lt;", "\u0139": "&Lacute;", "\u039B": "&Lambda;", "\u27EA": "&Lang;", "\u2112": "&lagran;", "\u219E": "&twoheadleftarrow;", "\u013D": "&Lcaron;", "\u013B": "&Lcedil;", "\u041B": "&Lcy;", "\u27E8": "&langle;", "\u2190": "&slarr;", "\u21E4": "&larrb;", "\u21C6": "&lrarr;", "\u2308": "&lceil;", "\u27E6": "&lobrk;", "\u2961": "&LeftDownTeeVector;", "\u21C3": "&downharpoonleft;", "\u2959": "&LeftDownVectorBar;", "\u230A": "&lfloor;", "\u2194": "&leftrightarrow;", "\u294E": "&LeftRightVector;", "\u22A3": "&dashv;", "\u21A4": "&mapstoleft;", "\u295A": "&LeftTeeVector;", "\u22B2": "&vltri;", "\u29CF": "&LeftTriangleBar;", "\u22B4": "&trianglelefteq;", "\u2951": "&LeftUpDownVector;", "\u2960": "&LeftUpTeeVector;", "\u21BF": "&upharpoonleft;", "\u2958": "&LeftUpVectorBar;", "\u21BC": "&lharu;", "\u2952": "&LeftVectorBar;", "\u22DA": "&lesseqgtr;", "\u2266": "&leqq;", "\u2276": "&lg;", "\u2AA1": "&LessLess;", "\u2A7D": "&les;", "\u2272": "&lsim;", "\u{1D50F}": "&Lfr;", "\u22D8": "&Ll;", "\u21DA": "&lAarr;", "\u013F": "&Lmidot;", "\u27F5": "&xlarr;", "\u27F7": "&xharr;", "\u27F6": "&xrarr;", "\u{1D543}": "&Lopf;", "\u2199": "&swarrow;", "\u2198": "&searrow;", "\u21B0": "&lsh;", "\u0141": "&Lstrok;", "\u226A": "&ll;", "\u2905": "&Map;", "\u041C": "&Mcy;", "\u205F": "&MediumSpace;", "\u2133": "&phmmat;", "\u{1D510}": "&Mfr;", "\u2213": "&mp;", "\u{1D544}": "&Mopf;", "\u039C": "&Mu;", "\u040A": "&NJcy;", "\u0143": "&Nacute;", "\u0147": "&Ncaron;", "\u0145": "&Ncedil;", "\u041D": "&Ncy;", "\u200B": "&ZeroWidthSpace;", "\n": "&NewLine;", "\u{1D511}": "&Nfr;", "\u2060": "&NoBreak;", "\xA0": "&nbsp;", "\u2115": "&naturals;", "\u2AEC": "&Not;", "\u2262": "&nequiv;", "\u226D": "&NotCupCap;", "\u2226": "&nspar;", "\u2209": "&notinva;", "\u2260": "&ne;", "\u2242\u0338": "&nesim;", "\u2204": "&nexists;", "\u226F": "&ngtr;", "\u2271": "&ngeq;", "\u2267\u0338": "&ngeqq;", "\u226B\u0338": "&nGtv;", "\u2279": "&ntgl;", "\u2A7E\u0338": "&nges;", "\u2275": "&ngsim;", "\u224E\u0338": "&nbump;", "\u224F\u0338": "&nbumpe;", "\u22EA": "&ntriangleleft;", "\u29CF\u0338": "&NotLeftTriangleBar;", "\u22EC": "&ntrianglelefteq;", "\u226E": "&nlt;", "\u2270": "&nleq;", "\u2278": "&ntlg;", "\u226A\u0338": "&nLtv;", "\u2A7D\u0338": "&nles;", "\u2274": "&nlsim;", "\u2AA2\u0338": "&NotNestedGreaterGreater;", "\u2AA1\u0338": "&NotNestedLessLess;", "\u2280": "&nprec;", "\u2AAF\u0338": "&npreceq;", "\u22E0": "&nprcue;", "\u220C": "&notniva;", "\u22EB": "&ntriangleright;", "\u29D0\u0338": "&NotRightTriangleBar;", "\u22ED": "&ntrianglerighteq;", "\u228F\u0338": "&NotSquareSubset;", "\u22E2": "&nsqsube;", "\u2290\u0338": "&NotSquareSuperset;", "\u22E3": "&nsqsupe;", "\u2282\u20D2": "&vnsub;", "\u2288": "&nsubseteq;", "\u2281": "&nsucc;", "\u2AB0\u0338": "&nsucceq;", "\u22E1": "&nsccue;", "\u227F\u0338": "&NotSucceedsTilde;", "\u2283\u20D2": "&vnsup;", "\u2289": "&nsupseteq;", "\u2241": "&nsim;", "\u2244": "&nsimeq;", "\u2247": "&ncong;", "\u2249": "&napprox;", "\u2224": "&nsmid;", "\u{1D4A9}": "&Nscr;", "\xD1": "&Ntilde;", "\u039D": "&Nu;", "\u0152": "&OElig;", "\xD3": "&Oacute;", "\xD4": "&Ocirc;", "\u041E": "&Ocy;", "\u0150": "&Odblac;", "\u{1D512}": "&Ofr;", "\xD2": "&Ograve;", "\u014C": "&Omacr;", "\u03A9": "&ohm;", "\u039F": "&Omicron;", "\u{1D546}": "&Oopf;", "\u201C": "&ldquo;", "\u2018": "&lsquo;", "\u2A54": "&Or;", "\u{1D4AA}": "&Oscr;", "\xD8": "&Oslash;", "\xD5": "&Otilde;", "\u2A37": "&Otimes;", "\xD6": "&Ouml;", "\u203E": "&oline;", "\u23DE": "&OverBrace;", "\u23B4": "&tbrk;", "\u23DC": "&OverParenthesis;", "\u2202": "&part;", "\u041F": "&Pcy;", "\u{1D513}": "&Pfr;", "\u03A6": "&Phi;", "\u03A0": "&Pi;", "\xB1": "&pm;", "\u2119": "&primes;", "\u2ABB": "&Pr;", "\u227A": "&prec;", "\u2AAF": "&preceq;", "\u227C": "&preccurlyeq;", "\u227E": "&prsim;", "\u2033": "&Prime;", "\u220F": "&prod;", "\u221D": "&vprop;", "\u{1D4AB}": "&Pscr;", "\u03A8": "&Psi;", '"': "&quot;", "\u{1D514}": "&Qfr;", "\u211A": "&rationals;", "\u{1D4AC}": "&Qscr;", "\u2910": "&drbkarow;", "\xAE": "&reg;", "\u0154": "&Racute;", "\u27EB": "&Rang;", "\u21A0": "&twoheadrightarrow;", "\u2916": "&Rarrtl;", "\u0158": "&Rcaron;", "\u0156": "&Rcedil;", "\u0420": "&Rcy;", "\u211C": "&realpart;", "\u220B": "&niv;", "\u21CB": "&lrhar;", "\u296F": "&duhar;", "\u03A1": "&Rho;", "\u27E9": "&rangle;", "\u2192": "&srarr;", "\u21E5": "&rarrb;", "\u21C4": "&rlarr;", "\u2309": "&rceil;", "\u27E7": "&robrk;", "\u295D": "&RightDownTeeVector;", "\u21C2": "&downharpoonright;", "\u2955": "&RightDownVectorBar;", "\u230B": "&rfloor;", "\u22A2": "&vdash;", "\u21A6": "&mapsto;", "\u295B": "&RightTeeVector;", "\u22B3": "&vrtri;", "\u29D0": "&RightTriangleBar;", "\u22B5": "&trianglerighteq;", "\u294F": "&RightUpDownVector;", "\u295C": "&RightUpTeeVector;", "\u21BE": "&upharpoonright;", "\u2954": "&RightUpVectorBar;", "\u21C0": "&rightharpoonup;", "\u2953": "&RightVectorBar;", "\u211D": "&reals;", "\u2970": "&RoundImplies;", "\u21DB": "&rAarr;", "\u211B": "&realine;", "\u21B1": "&rsh;", "\u29F4": "&RuleDelayed;", "\u0429": "&SHCHcy;", "\u0428": "&SHcy;", "\u042C": "&SOFTcy;", "\u015A": "&Sacute;", "\u2ABC": "&Sc;", "\u0160": "&Scaron;", "\u015E": "&Scedil;", "\u015C": "&Scirc;", "\u0421": "&Scy;", "\u{1D516}": "&Sfr;", "\u2191": "&uparrow;", "\u03A3": "&Sigma;", "\u2218": "&compfn;", "\u{1D54A}": "&Sopf;", "\u221A": "&radic;", "\u25A1": "&square;", "\u2293": "&sqcap;", "\u228F": "&sqsubset;", "\u2291": "&sqsubseteq;", "\u2290": "&sqsupset;", "\u2292": "&sqsupseteq;", "\u2294": "&sqcup;", "\u{1D4AE}": "&Sscr;", "\u22C6": "&sstarf;", "\u22D0": "&Subset;", "\u2286": "&subseteq;", "\u227B": "&succ;", "\u2AB0": "&succeq;", "\u227D": "&succcurlyeq;", "\u227F": "&succsim;", "\u2211": "&sum;", "\u22D1": "&Supset;", "\u2283": "&supset;", "\u2287": "&supseteq;", "\xDE": "&THORN;", "\u2122": "&trade;", "\u040B": "&TSHcy;", "\u0426": "&TScy;", "	": "&Tab;", "\u03A4": "&Tau;", "\u0164": "&Tcaron;", "\u0162": "&Tcedil;", "\u0422": "&Tcy;", "\u{1D517}": "&Tfr;", "\u2234": "&therefore;", "\u0398": "&Theta;", "\u205F\u200A": "&ThickSpace;", "\u2009": "&thinsp;", "\u223C": "&thksim;", "\u2243": "&simeq;", "\u2245": "&cong;", "\u2248": "&thkap;", "\u{1D54B}": "&Topf;", "\u20DB": "&tdot;", "\u{1D4AF}": "&Tscr;", "\u0166": "&Tstrok;", "\xDA": "&Uacute;", "\u219F": "&Uarr;", "\u2949": "&Uarrocir;", "\u040E": "&Ubrcy;", "\u016C": "&Ubreve;", "\xDB": "&Ucirc;", "\u0423": "&Ucy;", "\u0170": "&Udblac;", "\u{1D518}": "&Ufr;", "\xD9": "&Ugrave;", "\u016A": "&Umacr;", _: "&lowbar;", "\u23DF": "&UnderBrace;", "\u23B5": "&bbrk;", "\u23DD": "&UnderParenthesis;", "\u22C3": "&xcup;", "\u228E": "&uplus;", "\u0172": "&Uogon;", "\u{1D54C}": "&Uopf;", "\u2912": "&UpArrowBar;", "\u21C5": "&udarr;", "\u2195": "&varr;", "\u296E": "&udhar;", "\u22A5": "&perp;", "\u21A5": "&mapstoup;", "\u2196": "&nwarrow;", "\u2197": "&nearrow;", "\u03D2": "&upsih;", "\u03A5": "&Upsilon;", "\u016E": "&Uring;", "\u{1D4B0}": "&Uscr;", "\u0168": "&Utilde;", "\xDC": "&Uuml;", "\u22AB": "&VDash;", "\u2AEB": "&Vbar;", "\u0412": "&Vcy;", "\u22A9": "&Vdash;", "\u2AE6": "&Vdashl;", "\u22C1": "&xvee;", "\u2016": "&Vert;", "\u2223": "&smid;", "|": "&vert;", "\u2758": "&VerticalSeparator;", "\u2240": "&wreath;", "\u200A": "&hairsp;", "\u{1D519}": "&Vfr;", "\u{1D54D}": "&Vopf;", "\u{1D4B1}": "&Vscr;", "\u22AA": "&Vvdash;", "\u0174": "&Wcirc;", "\u22C0": "&xwedge;", "\u{1D51A}": "&Wfr;", "\u{1D54E}": "&Wopf;", "\u{1D4B2}": "&Wscr;", "\u{1D51B}": "&Xfr;", "\u039E": "&Xi;", "\u{1D54F}": "&Xopf;", "\u{1D4B3}": "&Xscr;", "\u042F": "&YAcy;", "\u0407": "&YIcy;", "\u042E": "&YUcy;", "\xDD": "&Yacute;", "\u0176": "&Ycirc;", "\u042B": "&Ycy;", "\u{1D51C}": "&Yfr;", "\u{1D550}": "&Yopf;", "\u{1D4B4}": "&Yscr;", "\u0178": "&Yuml;", "\u0416": "&ZHcy;", "\u0179": "&Zacute;", "\u017D": "&Zcaron;", "\u0417": "&Zcy;", "\u017B": "&Zdot;", "\u0396": "&Zeta;", "\u2128": "&zeetrf;", "\u2124": "&integers;", "\u{1D4B5}": "&Zscr;", "\xE1": "&aacute;", "\u0103": "&abreve;", "\u223E": "&mstpos;", "\u223E\u0333": "&acE;", "\u223F": "&acd;", "\xE2": "&acirc;", "\u0430": "&acy;", "\xE6": "&aelig;", "\u{1D51E}": "&afr;", "\xE0": "&agrave;", "\u2135": "&aleph;", "\u03B1": "&alpha;", "\u0101": "&amacr;", "\u2A3F": "&amalg;", "\u2227": "&wedge;", "\u2A55": "&andand;", "\u2A5C": "&andd;", "\u2A58": "&andslope;", "\u2A5A": "&andv;", "\u2220": "&angle;", "\u29A4": "&ange;", "\u2221": "&measuredangle;", "\u29A8": "&angmsdaa;", "\u29A9": "&angmsdab;", "\u29AA": "&angmsdac;", "\u29AB": "&angmsdad;", "\u29AC": "&angmsdae;", "\u29AD": "&angmsdaf;", "\u29AE": "&angmsdag;", "\u29AF": "&angmsdah;", "\u221F": "&angrt;", "\u22BE": "&angrtvb;", "\u299D": "&angrtvbd;", "\u2222": "&angsph;", "\u237C": "&angzarr;", "\u0105": "&aogon;", "\u{1D552}": "&aopf;", "\u2A70": "&apE;", "\u2A6F": "&apacir;", "\u224A": "&approxeq;", "\u224B": "&apid;", "'": "&apos;", "\xE5": "&aring;", "\u{1D4B6}": "&ascr;", "*": "&midast;", "\xE3": "&atilde;", "\xE4": "&auml;", "\u2A11": "&awint;", "\u2AED": "&bNot;", "\u224C": "&bcong;", "\u03F6": "&bepsi;", "\u2035": "&bprime;", "\u223D": "&bsim;", "\u22CD": "&bsime;", "\u22BD": "&barvee;", "\u2305": "&barwedge;", "\u23B6": "&bbrktbrk;", "\u0431": "&bcy;", "\u201E": "&ldquor;", "\u29B0": "&bemptyv;", "\u03B2": "&beta;", "\u2136": "&beth;", "\u226C": "&twixt;", "\u{1D51F}": "&bfr;", "\u25EF": "&xcirc;", "\u2A00": "&xodot;", "\u2A01": "&xoplus;", "\u2A02": "&xotime;", "\u2A06": "&xsqcup;", "\u2605": "&starf;", "\u25BD": "&xdtri;", "\u25B3": "&xutri;", "\u2A04": "&xuplus;", "\u290D": "&rbarr;", "\u29EB": "&lozf;", "\u25B4": "&utrif;", "\u25BE": "&dtrif;", "\u25C2": "&ltrif;", "\u25B8": "&rtrif;", "\u2423": "&blank;", "\u2592": "&blk12;", "\u2591": "&blk14;", "\u2593": "&blk34;", "\u2588": "&block;", "=\u20E5": "&bne;", "\u2261\u20E5": "&bnequiv;", "\u2310": "&bnot;", "\u{1D553}": "&bopf;", "\u22C8": "&bowtie;", "\u2557": "&boxDL;", "\u2554": "&boxDR;", "\u2556": "&boxDl;", "\u2553": "&boxDr;", "\u2550": "&boxH;", "\u2566": "&boxHD;", "\u2569": "&boxHU;", "\u2564": "&boxHd;", "\u2567": "&boxHu;", "\u255D": "&boxUL;", "\u255A": "&boxUR;", "\u255C": "&boxUl;", "\u2559": "&boxUr;", "\u2551": "&boxV;", "\u256C": "&boxVH;", "\u2563": "&boxVL;", "\u2560": "&boxVR;", "\u256B": "&boxVh;", "\u2562": "&boxVl;", "\u255F": "&boxVr;", "\u29C9": "&boxbox;", "\u2555": "&boxdL;", "\u2552": "&boxdR;", "\u2510": "&boxdl;", "\u250C": "&boxdr;", "\u2565": "&boxhD;", "\u2568": "&boxhU;", "\u252C": "&boxhd;", "\u2534": "&boxhu;", "\u229F": "&minusb;", "\u229E": "&plusb;", "\u22A0": "&timesb;", "\u255B": "&boxuL;", "\u2558": "&boxuR;", "\u2518": "&boxul;", "\u2514": "&boxur;", "\u2502": "&boxv;", "\u256A": "&boxvH;", "\u2561": "&boxvL;", "\u255E": "&boxvR;", "\u253C": "&boxvh;", "\u2524": "&boxvl;", "\u251C": "&boxvr;", "\xA6": "&brvbar;", "\u{1D4B7}": "&bscr;", "\u204F": "&bsemi;", "\\": "&bsol;", "\u29C5": "&bsolb;", "\u27C8": "&bsolhsub;", "\u2022": "&bullet;", "\u2AAE": "&bumpE;", "\u0107": "&cacute;", "\u2229": "&cap;", "\u2A44": "&capand;", "\u2A49": "&capbrcup;", "\u2A4B": "&capcap;", "\u2A47": "&capcup;", "\u2A40": "&capdot;", "\u2229\uFE00": "&caps;", "\u2041": "&caret;", "\u2A4D": "&ccaps;", "\u010D": "&ccaron;", "\xE7": "&ccedil;", "\u0109": "&ccirc;", "\u2A4C": "&ccups;", "\u2A50": "&ccupssm;", "\u010B": "&cdot;", "\u29B2": "&cemptyv;", "\xA2": "&cent;", "\u{1D520}": "&cfr;", "\u0447": "&chcy;", "\u2713": "&checkmark;", "\u03C7": "&chi;", "\u25CB": "&cir;", "\u29C3": "&cirE;", "\u02C6": "&circ;", "\u2257": "&cire;", "\u21BA": "&olarr;", "\u21BB": "&orarr;", "\u24C8": "&oS;", "\u229B": "&oast;", "\u229A": "&ocir;", "\u229D": "&odash;", "\u2A10": "&cirfnint;", "\u2AEF": "&cirmid;", "\u29C2": "&cirscir;", "\u2663": "&clubsuit;", ":": "&colon;", ",": "&comma;", "@": "&commat;", "\u2201": "&complement;", "\u2A6D": "&congdot;", "\u{1D554}": "&copf;", "\u2117": "&copysr;", "\u21B5": "&crarr;", "\u2717": "&cross;", "\u{1D4B8}": "&cscr;", "\u2ACF": "&csub;", "\u2AD1": "&csube;", "\u2AD0": "&csup;", "\u2AD2": "&csupe;", "\u22EF": "&ctdot;", "\u2938": "&cudarrl;", "\u2935": "&cudarrr;", "\u22DE": "&curlyeqprec;", "\u22DF": "&curlyeqsucc;", "\u21B6": "&curvearrowleft;", "\u293D": "&cularrp;", "\u222A": "&cup;", "\u2A48": "&cupbrcap;", "\u2A46": "&cupcap;", "\u2A4A": "&cupcup;", "\u228D": "&cupdot;", "\u2A45": "&cupor;", "\u222A\uFE00": "&cups;", "\u21B7": "&curvearrowright;", "\u293C": "&curarrm;", "\u22CE": "&cuvee;", "\u22CF": "&cuwed;", "\xA4": "&curren;", "\u2231": "&cwint;", "\u232D": "&cylcty;", "\u2965": "&dHar;", "\u2020": "&dagger;", "\u2138": "&daleth;", "\u2010": "&hyphen;", "\u290F": "&rBarr;", "\u010F": "&dcaron;", "\u0434": "&dcy;", "\u21CA": "&downdownarrows;", "\u2A77": "&eDDot;", "\xB0": "&deg;", "\u03B4": "&delta;", "\u29B1": "&demptyv;", "\u297F": "&dfisht;", "\u{1D521}": "&dfr;", "\u2666": "&diams;", "\u03DD": "&gammad;", "\u22F2": "&disin;", "\xF7": "&divide;", "\u22C7": "&divonx;", "\u0452": "&djcy;", "\u231E": "&llcorner;", "\u230D": "&dlcrop;", $: "&dollar;", "\u{1D555}": "&dopf;", "\u2251": "&eDot;", "\u2238": "&minusd;", "\u2214": "&plusdo;", "\u22A1": "&sdotb;", "\u231F": "&lrcorner;", "\u230C": "&drcrop;", "\u{1D4B9}": "&dscr;", "\u0455": "&dscy;", "\u29F6": "&dsol;", "\u0111": "&dstrok;", "\u22F1": "&dtdot;", "\u25BF": "&triangledown;", "\u29A6": "&dwangle;", "\u045F": "&dzcy;", "\u27FF": "&dzigrarr;", "\xE9": "&eacute;", "\u2A6E": "&easter;", "\u011B": "&ecaron;", "\u2256": "&eqcirc;", "\xEA": "&ecirc;", "\u2255": "&eqcolon;", "\u044D": "&ecy;", "\u0117": "&edot;", "\u2252": "&fallingdotseq;", "\u{1D522}": "&efr;", "\u2A9A": "&eg;", "\xE8": "&egrave;", "\u2A96": "&eqslantgtr;", "\u2A98": "&egsdot;", "\u2A99": "&el;", "\u23E7": "&elinters;", "\u2113": "&ell;", "\u2A95": "&eqslantless;", "\u2A97": "&elsdot;", "\u0113": "&emacr;", "\u2205": "&varnothing;", "\u2004": "&emsp13;", "\u2005": "&emsp14;", "\u2003": "&emsp;", "\u014B": "&eng;", "\u2002": "&ensp;", "\u0119": "&eogon;", "\u{1D556}": "&eopf;", "\u22D5": "&epar;", "\u29E3": "&eparsl;", "\u2A71": "&eplus;", "\u03B5": "&epsilon;", "\u03F5": "&varepsilon;", "=": "&equals;", "\u225F": "&questeq;", "\u2A78": "&equivDD;", "\u29E5": "&eqvparsl;", "\u2253": "&risingdotseq;", "\u2971": "&erarr;", "\u212F": "&escr;", "\u03B7": "&eta;", "\xF0": "&eth;", "\xEB": "&euml;", "\u20AC": "&euro;", "!": "&excl;", "\u0444": "&fcy;", "\u2640": "&female;", "\uFB03": "&ffilig;", "\uFB00": "&fflig;", "\uFB04": "&ffllig;", "\u{1D523}": "&ffr;", "\uFB01": "&filig;", fj: "&fjlig;", "\u266D": "&flat;", "\uFB02": "&fllig;", "\u25B1": "&fltns;", "\u0192": "&fnof;", "\u{1D557}": "&fopf;", "\u22D4": "&pitchfork;", "\u2AD9": "&forkv;", "\u2A0D": "&fpartint;", "\xBD": "&half;", "\u2153": "&frac13;", "\xBC": "&frac14;", "\u2155": "&frac15;", "\u2159": "&frac16;", "\u215B": "&frac18;", "\u2154": "&frac23;", "\u2156": "&frac25;", "\xBE": "&frac34;", "\u2157": "&frac35;", "\u215C": "&frac38;", "\u2158": "&frac45;", "\u215A": "&frac56;", "\u215D": "&frac58;", "\u215E": "&frac78;", "\u2044": "&frasl;", "\u2322": "&sfrown;", "\u{1D4BB}": "&fscr;", "\u2A8C": "&gtreqqless;", "\u01F5": "&gacute;", "\u03B3": "&gamma;", "\u2A86": "&gtrapprox;", "\u011F": "&gbreve;", "\u011D": "&gcirc;", "\u0433": "&gcy;", "\u0121": "&gdot;", "\u2AA9": "&gescc;", "\u2A80": "&gesdot;", "\u2A82": "&gesdoto;", "\u2A84": "&gesdotol;", "\u22DB\uFE00": "&gesl;", "\u2A94": "&gesles;", "\u{1D524}": "&gfr;", "\u2137": "&gimel;", "\u0453": "&gjcy;", "\u2A92": "&glE;", "\u2AA5": "&gla;", "\u2AA4": "&glj;", "\u2269": "&gneqq;", "\u2A8A": "&gnapprox;", "\u2A88": "&gneq;", "\u22E7": "&gnsim;", "\u{1D558}": "&gopf;", "\u210A": "&gscr;", "\u2A8E": "&gsime;", "\u2A90": "&gsiml;", "\u2AA7": "&gtcc;", "\u2A7A": "&gtcir;", "\u22D7": "&gtrdot;", "\u2995": "&gtlPar;", "\u2A7C": "&gtquest;", "\u2978": "&gtrarr;", "\u2269\uFE00": "&gvnE;", "\u044A": "&hardcy;", "\u2948": "&harrcir;", "\u21AD": "&leftrightsquigarrow;", "\u210F": "&plankv;", "\u0125": "&hcirc;", "\u2665": "&heartsuit;", "\u2026": "&mldr;", "\u22B9": "&hercon;", "\u{1D525}": "&hfr;", "\u2925": "&searhk;", "\u2926": "&swarhk;", "\u21FF": "&hoarr;", "\u223B": "&homtht;", "\u21A9": "&larrhk;", "\u21AA": "&rarrhk;", "\u{1D559}": "&hopf;", "\u2015": "&horbar;", "\u{1D4BD}": "&hscr;", "\u0127": "&hstrok;", "\u2043": "&hybull;", "\xED": "&iacute;", "\xEE": "&icirc;", "\u0438": "&icy;", "\u0435": "&iecy;", "\xA1": "&iexcl;", "\u{1D526}": "&ifr;", "\xEC": "&igrave;", "\u2A0C": "&qint;", "\u222D": "&tint;", "\u29DC": "&iinfin;", "\u2129": "&iiota;", "\u0133": "&ijlig;", "\u012B": "&imacr;", "\u0131": "&inodot;", "\u22B7": "&imof;", "\u01B5": "&imped;", "\u2105": "&incare;", "\u221E": "&infin;", "\u29DD": "&infintie;", "\u22BA": "&intercal;", "\u2A17": "&intlarhk;", "\u2A3C": "&iprod;", "\u0451": "&iocy;", "\u012F": "&iogon;", "\u{1D55A}": "&iopf;", "\u03B9": "&iota;", "\xBF": "&iquest;", "\u{1D4BE}": "&iscr;", "\u22F9": "&isinE;", "\u22F5": "&isindot;", "\u22F4": "&isins;", "\u22F3": "&isinsv;", "\u0129": "&itilde;", "\u0456": "&iukcy;", "\xEF": "&iuml;", "\u0135": "&jcirc;", "\u0439": "&jcy;", "\u{1D527}": "&jfr;", "\u0237": "&jmath;", "\u{1D55B}": "&jopf;", "\u{1D4BF}": "&jscr;", "\u0458": "&jsercy;", "\u0454": "&jukcy;", "\u03BA": "&kappa;", "\u03F0": "&varkappa;", "\u0137": "&kcedil;", "\u043A": "&kcy;", "\u{1D528}": "&kfr;", "\u0138": "&kgreen;", "\u0445": "&khcy;", "\u045C": "&kjcy;", "\u{1D55C}": "&kopf;", "\u{1D4C0}": "&kscr;", "\u291B": "&lAtail;", "\u290E": "&lBarr;", "\u2A8B": "&lesseqqgtr;", "\u2962": "&lHar;", "\u013A": "&lacute;", "\u29B4": "&laemptyv;", "\u03BB": "&lambda;", "\u2991": "&langd;", "\u2A85": "&lessapprox;", "\xAB": "&laquo;", "\u291F": "&larrbfs;", "\u291D": "&larrfs;", "\u21AB": "&looparrowleft;", "\u2939": "&larrpl;", "\u2973": "&larrsim;", "\u21A2": "&leftarrowtail;", "\u2AAB": "&lat;", "\u2919": "&latail;", "\u2AAD": "&late;", "\u2AAD\uFE00": "&lates;", "\u290C": "&lbarr;", "\u2772": "&lbbrk;", "{": "&lcub;", "[": "&lsqb;", "\u298B": "&lbrke;", "\u298F": "&lbrksld;", "\u298D": "&lbrkslu;", "\u013E": "&lcaron;", "\u013C": "&lcedil;", "\u043B": "&lcy;", "\u2936": "&ldca;", "\u2967": "&ldrdhar;", "\u294B": "&ldrushar;", "\u21B2": "&ldsh;", "\u2264": "&leq;", "\u21C7": "&llarr;", "\u22CB": "&lthree;", "\u2AA8": "&lescc;", "\u2A7F": "&lesdot;", "\u2A81": "&lesdoto;", "\u2A83": "&lesdotor;", "\u22DA\uFE00": "&lesg;", "\u2A93": "&lesges;", "\u22D6": "&ltdot;", "\u297C": "&lfisht;", "\u{1D529}": "&lfr;", "\u2A91": "&lgE;", "\u296A": "&lharul;", "\u2584": "&lhblk;", "\u0459": "&ljcy;", "\u296B": "&llhard;", "\u25FA": "&lltri;", "\u0140": "&lmidot;", "\u23B0": "&lmoustache;", "\u2268": "&lneqq;", "\u2A89": "&lnapprox;", "\u2A87": "&lneq;", "\u22E6": "&lnsim;", "\u27EC": "&loang;", "\u21FD": "&loarr;", "\u27FC": "&xmap;", "\u21AC": "&rarrlp;", "\u2985": "&lopar;", "\u{1D55D}": "&lopf;", "\u2A2D": "&loplus;", "\u2A34": "&lotimes;", "\u2217": "&lowast;", "\u25CA": "&lozenge;", "(": "&lpar;", "\u2993": "&lparlt;", "\u296D": "&lrhard;", "\u200E": "&lrm;", "\u22BF": "&lrtri;", "\u2039": "&lsaquo;", "\u{1D4C1}": "&lscr;", "\u2A8D": "&lsime;", "\u2A8F": "&lsimg;", "\u201A": "&sbquo;", "\u0142": "&lstrok;", "\u2AA6": "&ltcc;", "\u2A79": "&ltcir;", "\u22C9": "&ltimes;", "\u2976": "&ltlarr;", "\u2A7B": "&ltquest;", "\u2996": "&ltrPar;", "\u25C3": "&triangleleft;", "\u294A": "&lurdshar;", "\u2966": "&luruhar;", "\u2268\uFE00": "&lvnE;", "\u223A": "&mDDot;", "\xAF": "&strns;", "\u2642": "&male;", "\u2720": "&maltese;", "\u25AE": "&marker;", "\u2A29": "&mcomma;", "\u043C": "&mcy;", "\u2014": "&mdash;", "\u{1D52A}": "&mfr;", "\u2127": "&mho;", "\xB5": "&micro;", "\u2AF0": "&midcir;", "\u2212": "&minus;", "\u2A2A": "&minusdu;", "\u2ADB": "&mlcp;", "\u22A7": "&models;", "\u{1D55E}": "&mopf;", "\u{1D4C2}": "&mscr;", "\u03BC": "&mu;", "\u22B8": "&mumap;", "\u22D9\u0338": "&nGg;", "\u226B\u20D2": "&nGt;", "\u21CD": "&nlArr;", "\u21CE": "&nhArr;", "\u22D8\u0338": "&nLl;", "\u226A\u20D2": "&nLt;", "\u21CF": "&nrArr;", "\u22AF": "&nVDash;", "\u22AE": "&nVdash;", "\u0144": "&nacute;", "\u2220\u20D2": "&nang;", "\u2A70\u0338": "&napE;", "\u224B\u0338": "&napid;", "\u0149": "&napos;", "\u266E": "&natural;", "\u2A43": "&ncap;", "\u0148": "&ncaron;", "\u0146": "&ncedil;", "\u2A6D\u0338": "&ncongdot;", "\u2A42": "&ncup;", "\u043D": "&ncy;", "\u2013": "&ndash;", "\u21D7": "&neArr;", "\u2924": "&nearhk;", "\u2250\u0338": "&nedot;", "\u2928": "&toea;", "\u{1D52B}": "&nfr;", "\u21AE": "&nleftrightarrow;", "\u2AF2": "&nhpar;", "\u22FC": "&nis;", "\u22FA": "&nisd;", "\u045A": "&njcy;", "\u2266\u0338": "&nleqq;", "\u219A": "&nleftarrow;", "\u2025": "&nldr;", "\u{1D55F}": "&nopf;", "\xAC": "&not;", "\u22F9\u0338": "&notinE;", "\u22F5\u0338": "&notindot;", "\u22F7": "&notinvb;", "\u22F6": "&notinvc;", "\u22FE": "&notnivb;", "\u22FD": "&notnivc;", "\u2AFD\u20E5": "&nparsl;", "\u2202\u0338": "&npart;", "\u2A14": "&npolint;", "\u219B": "&nrightarrow;", "\u2933\u0338": "&nrarrc;", "\u219D\u0338": "&nrarrw;", "\u{1D4C3}": "&nscr;", "\u2284": "&nsub;", "\u2AC5\u0338": "&nsubseteqq;", "\u2285": "&nsup;", "\u2AC6\u0338": "&nsupseteqq;", "\xF1": "&ntilde;", "\u03BD": "&nu;", "#": "&num;", "\u2116": "&numero;", "\u2007": "&numsp;", "\u22AD": "&nvDash;", "\u2904": "&nvHarr;", "\u224D\u20D2": "&nvap;", "\u22AC": "&nvdash;", "\u2265\u20D2": "&nvge;", ">\u20D2": "&nvgt;", "\u29DE": "&nvinfin;", "\u2902": "&nvlArr;", "\u2264\u20D2": "&nvle;", "<\u20D2": "&nvlt;", "\u22B4\u20D2": "&nvltrie;", "\u2903": "&nvrArr;", "\u22B5\u20D2": "&nvrtrie;", "\u223C\u20D2": "&nvsim;", "\u21D6": "&nwArr;", "\u2923": "&nwarhk;", "\u2927": "&nwnear;", "\xF3": "&oacute;", "\xF4": "&ocirc;", "\u043E": "&ocy;", "\u0151": "&odblac;", "\u2A38": "&odiv;", "\u29BC": "&odsold;", "\u0153": "&oelig;", "\u29BF": "&ofcir;", "\u{1D52C}": "&ofr;", "\u02DB": "&ogon;", "\xF2": "&ograve;", "\u29C1": "&ogt;", "\u29B5": "&ohbar;", "\u29BE": "&olcir;", "\u29BB": "&olcross;", "\u29C0": "&olt;", "\u014D": "&omacr;", "\u03C9": "&omega;", "\u03BF": "&omicron;", "\u29B6": "&omid;", "\u{1D560}": "&oopf;", "\u29B7": "&opar;", "\u29B9": "&operp;", "\u2228": "&vee;", "\u2A5D": "&ord;", "\u2134": "&oscr;", "\xAA": "&ordf;", "\xBA": "&ordm;", "\u22B6": "&origof;", "\u2A56": "&oror;", "\u2A57": "&orslope;", "\u2A5B": "&orv;", "\xF8": "&oslash;", "\u2298": "&osol;", "\xF5": "&otilde;", "\u2A36": "&otimesas;", "\xF6": "&ouml;", "\u233D": "&ovbar;", "\xB6": "&para;", "\u2AF3": "&parsim;", "\u2AFD": "&parsl;", "\u043F": "&pcy;", "%": "&percnt;", ".": "&period;", "\u2030": "&permil;", "\u2031": "&pertenk;", "\u{1D52D}": "&pfr;", "\u03C6": "&phi;", "\u03D5": "&varphi;", "\u260E": "&phone;", "\u03C0": "&pi;", "\u03D6": "&varpi;", "\u210E": "&planckh;", "+": "&plus;", "\u2A23": "&plusacir;", "\u2A22": "&pluscir;", "\u2A25": "&plusdu;", "\u2A72": "&pluse;", "\u2A26": "&plussim;", "\u2A27": "&plustwo;", "\u2A15": "&pointint;", "\u{1D561}": "&popf;", "\xA3": "&pound;", "\u2AB3": "&prE;", "\u2AB7": "&precapprox;", "\u2AB9": "&prnap;", "\u2AB5": "&prnE;", "\u22E8": "&prnsim;", "\u2032": "&prime;", "\u232E": "&profalar;", "\u2312": "&profline;", "\u2313": "&profsurf;", "\u22B0": "&prurel;", "\u{1D4C5}": "&pscr;", "\u03C8": "&psi;", "\u2008": "&puncsp;", "\u{1D52E}": "&qfr;", "\u{1D562}": "&qopf;", "\u2057": "&qprime;", "\u{1D4C6}": "&qscr;", "\u2A16": "&quatint;", "?": "&quest;", "\u291C": "&rAtail;", "\u2964": "&rHar;", "\u223D\u0331": "&race;", "\u0155": "&racute;", "\u29B3": "&raemptyv;", "\u2992": "&rangd;", "\u29A5": "&range;", "\xBB": "&raquo;", "\u2975": "&rarrap;", "\u2920": "&rarrbfs;", "\u2933": "&rarrc;", "\u291E": "&rarrfs;", "\u2945": "&rarrpl;", "\u2974": "&rarrsim;", "\u21A3": "&rightarrowtail;", "\u219D": "&rightsquigarrow;", "\u291A": "&ratail;", "\u2236": "&ratio;", "\u2773": "&rbbrk;", "}": "&rcub;", "]": "&rsqb;", "\u298C": "&rbrke;", "\u298E": "&rbrksld;", "\u2990": "&rbrkslu;", "\u0159": "&rcaron;", "\u0157": "&rcedil;", "\u0440": "&rcy;", "\u2937": "&rdca;", "\u2969": "&rdldhar;", "\u21B3": "&rdsh;", "\u25AD": "&rect;", "\u297D": "&rfisht;", "\u{1D52F}": "&rfr;", "\u296C": "&rharul;", "\u03C1": "&rho;", "\u03F1": "&varrho;", "\u21C9": "&rrarr;", "\u22CC": "&rthree;", "\u02DA": "&ring;", "\u200F": "&rlm;", "\u23B1": "&rmoustache;", "\u2AEE": "&rnmid;", "\u27ED": "&roang;", "\u21FE": "&roarr;", "\u2986": "&ropar;", "\u{1D563}": "&ropf;", "\u2A2E": "&roplus;", "\u2A35": "&rotimes;", ")": "&rpar;", "\u2994": "&rpargt;", "\u2A12": "&rppolint;", "\u203A": "&rsaquo;", "\u{1D4C7}": "&rscr;", "\u22CA": "&rtimes;", "\u25B9": "&triangleright;", "\u29CE": "&rtriltri;", "\u2968": "&ruluhar;", "\u211E": "&rx;", "\u015B": "&sacute;", "\u2AB4": "&scE;", "\u2AB8": "&succapprox;", "\u0161": "&scaron;", "\u015F": "&scedil;", "\u015D": "&scirc;", "\u2AB6": "&succneqq;", "\u2ABA": "&succnapprox;", "\u22E9": "&succnsim;", "\u2A13": "&scpolint;", "\u0441": "&scy;", "\u22C5": "&sdot;", "\u2A66": "&sdote;", "\u21D8": "&seArr;", "\xA7": "&sect;", ";": "&semi;", "\u2929": "&tosa;", "\u2736": "&sext;", "\u{1D530}": "&sfr;", "\u266F": "&sharp;", "\u0449": "&shchcy;", "\u0448": "&shcy;", "\xAD": "&shy;", "\u03C3": "&sigma;", "\u03C2": "&varsigma;", "\u2A6A": "&simdot;", "\u2A9E": "&simg;", "\u2AA0": "&simgE;", "\u2A9D": "&siml;", "\u2A9F": "&simlE;", "\u2246": "&simne;", "\u2A24": "&simplus;", "\u2972": "&simrarr;", "\u2A33": "&smashp;", "\u29E4": "&smeparsl;", "\u2323": "&ssmile;", "\u2AAA": "&smt;", "\u2AAC": "&smte;", "\u2AAC\uFE00": "&smtes;", "\u044C": "&softcy;", "/": "&sol;", "\u29C4": "&solb;", "\u233F": "&solbar;", "\u{1D564}": "&sopf;", "\u2660": "&spadesuit;", "\u2293\uFE00": "&sqcaps;", "\u2294\uFE00": "&sqcups;", "\u{1D4C8}": "&sscr;", "\u2606": "&star;", "\u2282": "&subset;", "\u2AC5": "&subseteqq;", "\u2ABD": "&subdot;", "\u2AC3": "&subedot;", "\u2AC1": "&submult;", "\u2ACB": "&subsetneqq;", "\u228A": "&subsetneq;", "\u2ABF": "&subplus;", "\u2979": "&subrarr;", "\u2AC7": "&subsim;", "\u2AD5": "&subsub;", "\u2AD3": "&subsup;", "\u266A": "&sung;", "\xB9": "&sup1;", "\xB2": "&sup2;", "\xB3": "&sup3;", "\u2AC6": "&supseteqq;", "\u2ABE": "&supdot;", "\u2AD8": "&supdsub;", "\u2AC4": "&supedot;", "\u27C9": "&suphsol;", "\u2AD7": "&suphsub;", "\u297B": "&suplarr;", "\u2AC2": "&supmult;", "\u2ACC": "&supsetneqq;", "\u228B": "&supsetneq;", "\u2AC0": "&supplus;", "\u2AC8": "&supsim;", "\u2AD4": "&supsub;", "\u2AD6": "&supsup;", "\u21D9": "&swArr;", "\u292A": "&swnwar;", "\xDF": "&szlig;", "\u2316": "&target;", "\u03C4": "&tau;", "\u0165": "&tcaron;", "\u0163": "&tcedil;", "\u0442": "&tcy;", "\u2315": "&telrec;", "\u{1D531}": "&tfr;", "\u03B8": "&theta;", "\u03D1": "&vartheta;", "\xFE": "&thorn;", "\xD7": "&times;", "\u2A31": "&timesbar;", "\u2A30": "&timesd;", "\u2336": "&topbot;", "\u2AF1": "&topcir;", "\u{1D565}": "&topf;", "\u2ADA": "&topfork;", "\u2034": "&tprime;", "\u25B5": "&utri;", "\u225C": "&trie;", "\u25EC": "&tridot;", "\u2A3A": "&triminus;", "\u2A39": "&triplus;", "\u29CD": "&trisb;", "\u2A3B": "&tritime;", "\u23E2": "&trpezium;", "\u{1D4C9}": "&tscr;", "\u0446": "&tscy;", "\u045B": "&tshcy;", "\u0167": "&tstrok;", "\u2963": "&uHar;", "\xFA": "&uacute;", "\u045E": "&ubrcy;", "\u016D": "&ubreve;", "\xFB": "&ucirc;", "\u0443": "&ucy;", "\u0171": "&udblac;", "\u297E": "&ufisht;", "\u{1D532}": "&ufr;", "\xF9": "&ugrave;", "\u2580": "&uhblk;", "\u231C": "&ulcorner;", "\u230F": "&ulcrop;", "\u25F8": "&ultri;", "\u016B": "&umacr;", "\u0173": "&uogon;", "\u{1D566}": "&uopf;", "\u03C5": "&upsilon;", "\u21C8": "&uuarr;", "\u231D": "&urcorner;", "\u230E": "&urcrop;", "\u016F": "&uring;", "\u25F9": "&urtri;", "\u{1D4CA}": "&uscr;", "\u22F0": "&utdot;", "\u0169": "&utilde;", "\xFC": "&uuml;", "\u29A7": "&uwangle;", "\u2AE8": "&vBar;", "\u2AE9": "&vBarv;", "\u299C": "&vangrt;", "\u228A\uFE00": "&vsubne;", "\u2ACB\uFE00": "&vsubnE;", "\u228B\uFE00": "&vsupne;", "\u2ACC\uFE00": "&vsupnE;", "\u0432": "&vcy;", "\u22BB": "&veebar;", "\u225A": "&veeeq;", "\u22EE": "&vellip;", "\u{1D533}": "&vfr;", "\u{1D567}": "&vopf;", "\u{1D4CB}": "&vscr;", "\u299A": "&vzigzag;", "\u0175": "&wcirc;", "\u2A5F": "&wedbar;", "\u2259": "&wedgeq;", "\u2118": "&wp;", "\u{1D534}": "&wfr;", "\u{1D568}": "&wopf;", "\u{1D4CC}": "&wscr;", "\u{1D535}": "&xfr;", "\u03BE": "&xi;", "\u22FB": "&xnis;", "\u{1D569}": "&xopf;", "\u{1D4CD}": "&xscr;", "\xFD": "&yacute;", "\u044F": "&yacy;", "\u0177": "&ycirc;", "\u044B": "&ycy;", "\xA5": "&yen;", "\u{1D536}": "&yfr;", "\u0457": "&yicy;", "\u{1D56A}": "&yopf;", "\u{1D4CE}": "&yscr;", "\u044E": "&yucy;", "\xFF": "&yuml;", "\u017A": "&zacute;", "\u017E": "&zcaron;", "\u0437": "&zcy;", "\u017C": "&zdot;", "\u03B6": "&zeta;", "\u{1D537}": "&zfr;", "\u0436": "&zhcy;", "\u21DD": "&zigrarr;", "\u{1D56B}": "&zopf;", "\u{1D4CF}": "&zscr;", "\u200D": "&zwj;", "\u200C": "&zwnj;" } } };
    }
  });

  // ../../node_modules/html-entities/lib/numeric-unicode-map.js
  var require_numeric_unicode_map = __commonJS({
    "../../node_modules/html-entities/lib/numeric-unicode-map.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.numericUnicodeMap = { 0: 65533, 128: 8364, 130: 8218, 131: 402, 132: 8222, 133: 8230, 134: 8224, 135: 8225, 136: 710, 137: 8240, 138: 352, 139: 8249, 140: 338, 142: 381, 145: 8216, 146: 8217, 147: 8220, 148: 8221, 149: 8226, 150: 8211, 151: 8212, 152: 732, 153: 8482, 154: 353, 155: 8250, 156: 339, 158: 382, 159: 376 };
    }
  });

  // ../../node_modules/html-entities/lib/surrogate-pairs.js
  var require_surrogate_pairs = __commonJS({
    "../../node_modules/html-entities/lib/surrogate-pairs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fromCodePoint = String.fromCodePoint || function(astralCodePoint) {
        return String.fromCharCode(Math.floor((astralCodePoint - 65536) / 1024) + 55296, (astralCodePoint - 65536) % 1024 + 56320);
      };
      exports.getCodePoint = String.prototype.codePointAt ? function(input, position) {
        return input.codePointAt(position);
      } : function(input, position) {
        return (input.charCodeAt(position) - 55296) * 1024 + input.charCodeAt(position + 1) - 56320 + 65536;
      };
      exports.highSurrogateFrom = 55296;
      exports.highSurrogateTo = 56319;
    }
  });

  // ../../node_modules/html-entities/lib/index.js
  var require_lib = __commonJS({
    "../../node_modules/html-entities/lib/index.js"(exports) {
      "use strict";
      var __assign = exports && exports.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var named_references_1 = require_named_references();
      var numeric_unicode_map_1 = require_numeric_unicode_map();
      var surrogate_pairs_1 = require_surrogate_pairs();
      var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), { all: named_references_1.namedReferences.html5 });
      var encodeRegExps = {
        specialChars: /[<>'"&]/g,
        nonAscii: /[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
        nonAsciiPrintable: /[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
        nonAsciiPrintableOnly: /[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
        extensive: /[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g
      };
      var defaultEncodeOptions = {
        mode: "specialChars",
        level: "all",
        numeric: "decimal"
      };
      function encode2(text, _a) {
        var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? "specialChars" : _c, _d = _b.numeric, numeric = _d === void 0 ? "decimal" : _d, _e = _b.level, level = _e === void 0 ? "all" : _e;
        if (!text) {
          return "";
        }
        var encodeRegExp = encodeRegExps[mode];
        var references = allNamedReferences[level].characters;
        var isHex = numeric === "hexadecimal";
        encodeRegExp.lastIndex = 0;
        var _b = encodeRegExp.exec(text);
        var _c;
        if (_b) {
          _c = "";
          var _d = 0;
          do {
            if (_d !== _b.index) {
              _c += text.substring(_d, _b.index);
            }
            var _e = _b[0];
            var result_1 = references[_e];
            if (!result_1) {
              var code_1 = _e.length > 1 ? surrogate_pairs_1.getCodePoint(_e, 0) : _e.charCodeAt(0);
              result_1 = (isHex ? "&#x" + code_1.toString(16) : "&#" + code_1) + ";";
            }
            _c += result_1;
            _d = _b.index + _e.length;
          } while (_b = encodeRegExp.exec(text));
          if (_d !== text.length) {
            _c += text.substring(_d);
          }
        } else {
          _c = text;
        }
        return _c;
      }
      exports.encode = encode2;
      var defaultDecodeOptions = {
        scope: "body",
        level: "all"
      };
      var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
      var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
      var baseDecodeRegExps = {
        xml: {
          strict,
          attribute,
          body: named_references_1.bodyRegExps.xml
        },
        html4: {
          strict,
          attribute,
          body: named_references_1.bodyRegExps.html4
        },
        html5: {
          strict,
          attribute,
          body: named_references_1.bodyRegExps.html5
        }
      };
      var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
      var fromCharCode = String.fromCharCode;
      var outOfBoundsChar = fromCharCode(65533);
      var defaultDecodeEntityOptions = {
        level: "all"
      };
      function decodeEntity(entity, _a) {
        var _b = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _b === void 0 ? "all" : _b;
        if (!entity) {
          return "";
        }
        var _b = entity;
        var decodeEntityLastChar_1 = entity[entity.length - 1];
        if (false) {
          _b = entity;
        } else if (false) {
          _b = entity;
        } else {
          var decodeResultByReference_1 = allNamedReferences[level].entities[entity];
          if (decodeResultByReference_1) {
            _b = decodeResultByReference_1;
          } else if (entity[0] === "&" && entity[1] === "#") {
            var decodeSecondChar_1 = entity[2];
            var decodeCode_1 = decodeSecondChar_1 == "x" || decodeSecondChar_1 == "X" ? parseInt(entity.substr(3), 16) : parseInt(entity.substr(2));
            _b = decodeCode_1 >= 1114111 ? outOfBoundsChar : decodeCode_1 > 65535 ? surrogate_pairs_1.fromCodePoint(decodeCode_1) : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_1] || decodeCode_1);
          }
        }
        return _b;
      }
      exports.decodeEntity = decodeEntity;
      function decode2(text, _a) {
        var decodeSecondChar_1 = _a === void 0 ? defaultDecodeOptions : _a, decodeCode_1 = decodeSecondChar_1.level, level = decodeCode_1 === void 0 ? "all" : decodeCode_1, _b = decodeSecondChar_1.scope, scope = _b === void 0 ? level === "xml" ? "strict" : "body" : _b;
        if (!text) {
          return "";
        }
        var decodeRegExp = decodeRegExps[level][scope];
        var references = allNamedReferences[level].entities;
        var isAttribute = scope === "attribute";
        var isStrict = scope === "strict";
        decodeRegExp.lastIndex = 0;
        var replaceMatch_1 = decodeRegExp.exec(text);
        var replaceResult_1;
        if (replaceMatch_1) {
          replaceResult_1 = "";
          var replaceLastIndex_1 = 0;
          do {
            if (replaceLastIndex_1 !== replaceMatch_1.index) {
              replaceResult_1 += text.substring(replaceLastIndex_1, replaceMatch_1.index);
            }
            var replaceInput_1 = replaceMatch_1[0];
            var decodeResult_1 = replaceInput_1;
            var decodeEntityLastChar_2 = replaceInput_1[replaceInput_1.length - 1];
            if (isAttribute && decodeEntityLastChar_2 === "=") {
              decodeResult_1 = replaceInput_1;
            } else if (isStrict && decodeEntityLastChar_2 !== ";") {
              decodeResult_1 = replaceInput_1;
            } else {
              var decodeResultByReference_2 = references[replaceInput_1];
              if (decodeResultByReference_2) {
                decodeResult_1 = decodeResultByReference_2;
              } else if (replaceInput_1[0] === "&" && replaceInput_1[1] === "#") {
                var decodeSecondChar_2 = replaceInput_1[2];
                var decodeCode_2 = decodeSecondChar_2 == "x" || decodeSecondChar_2 == "X" ? parseInt(replaceInput_1.substr(3), 16) : parseInt(replaceInput_1.substr(2));
                decodeResult_1 = decodeCode_2 >= 1114111 ? outOfBoundsChar : decodeCode_2 > 65535 ? surrogate_pairs_1.fromCodePoint(decodeCode_2) : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_2] || decodeCode_2);
              }
            }
            replaceResult_1 += decodeResult_1;
            replaceLastIndex_1 = replaceMatch_1.index + replaceInput_1.length;
          } while (replaceMatch_1 = decodeRegExp.exec(text));
          if (replaceLastIndex_1 !== text.length) {
            replaceResult_1 += text.substring(replaceLastIndex_1);
          }
        } else {
          replaceResult_1 = text;
        }
        return replaceResult_1;
      }
      exports.decode = decode2;
    }
  });

  // ../../node_modules/entities/lib/maps/entities.json
  var require_entities = __commonJS({
    "../../node_modules/entities/lib/maps/entities.json"(exports, module) {
      module.exports = { Aacute: "\xC1", aacute: "\xE1", Abreve: "\u0102", abreve: "\u0103", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", Acy: "\u0410", acy: "\u0430", AElig: "\xC6", aelig: "\xE6", af: "\u2061", Afr: "\u{1D504}", afr: "\u{1D51E}", Agrave: "\xC0", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", Alpha: "\u0391", alpha: "\u03B1", Amacr: "\u0100", amacr: "\u0101", amalg: "\u2A3F", amp: "&", AMP: "&", andand: "\u2A55", And: "\u2A53", and: "\u2227", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angmsd: "\u2221", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", Aogon: "\u0104", aogon: "\u0105", Aopf: "\u{1D538}", aopf: "\u{1D552}", apacir: "\u2A6F", ap: "\u2248", apE: "\u2A70", ape: "\u224A", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", Aring: "\xC5", aring: "\xE5", Ascr: "\u{1D49C}", ascr: "\u{1D4B6}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", Bcy: "\u0411", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", Beta: "\u0392", beta: "\u03B2", beth: "\u2136", between: "\u226C", Bfr: "\u{1D505}", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bNot: "\u2AED", bnot: "\u2310", Bopf: "\u{1D539}", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxHd: "\u2564", boxhD: "\u2565", boxHD: "\u2566", boxhu: "\u2534", boxHu: "\u2567", boxhU: "\u2568", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsolb: "\u29C5", bsol: "\\", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", Bumpeq: "\u224E", bumpeq: "\u224F", Cacute: "\u0106", cacute: "\u0107", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", cap: "\u2229", Cap: "\u22D2", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", Ccaron: "\u010C", ccaron: "\u010D", Ccedil: "\xC7", ccedil: "\xE7", Ccirc: "\u0108", ccirc: "\u0109", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", Cdot: "\u010A", cdot: "\u010B", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", CHcy: "\u0427", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", Chi: "\u03A7", chi: "\u03C7", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cir: "\u25CB", cirE: "\u29C3", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", Colone: "\u2A74", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", Cscr: "\u{1D49E}", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cup: "\u222A", Cup: "\u22D3", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", Darr: "\u21A1", dArr: "\u21D3", dash: "\u2010", Dashv: "\u2AE4", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", Dcaron: "\u010E", dcaron: "\u010F", Dcy: "\u0414", dcy: "\u0434", ddagger: "\u2021", ddarr: "\u21CA", DD: "\u2145", dd: "\u2146", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", Delta: "\u0394", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", Dfr: "\u{1D507}", dfr: "\u{1D521}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", DJcy: "\u0402", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", Dopf: "\u{1D53B}", dopf: "\u{1D555}", Dot: "\xA8", dot: "\u02D9", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrowBar: "\u2913", downarrow: "\u2193", DownArrow: "\u2193", Downarrow: "\u21D3", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVectorBar: "\u2956", DownLeftVector: "\u21BD", DownRightTeeVector: "\u295F", DownRightVectorBar: "\u2957", DownRightVector: "\u21C1", DownTeeArrow: "\u21A7", DownTee: "\u22A4", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", Dscr: "\u{1D49F}", dscr: "\u{1D4B9}", DScy: "\u0405", dscy: "\u0455", dsol: "\u29F6", Dstrok: "\u0110", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", DZcy: "\u040F", dzcy: "\u045F", dzigrarr: "\u27FF", Eacute: "\xC9", eacute: "\xE9", easter: "\u2A6E", Ecaron: "\u011A", ecaron: "\u011B", Ecirc: "\xCA", ecirc: "\xEA", ecir: "\u2256", ecolon: "\u2255", Ecy: "\u042D", ecy: "\u044D", eDDot: "\u2A77", Edot: "\u0116", edot: "\u0117", eDot: "\u2251", ee: "\u2147", efDot: "\u2252", Efr: "\u{1D508}", efr: "\u{1D522}", eg: "\u2A9A", Egrave: "\xC8", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", Emacr: "\u0112", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", ENG: "\u014A", eng: "\u014B", ensp: "\u2002", Eogon: "\u0118", eogon: "\u0119", Eopf: "\u{1D53C}", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", Epsilon: "\u0395", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", Esim: "\u2A73", esim: "\u2242", Eta: "\u0397", eta: "\u03B7", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", Fcy: "\u0424", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", Ffr: "\u{1D509}", ffr: "\u{1D523}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", Fopf: "\u{1D53D}", fopf: "\u{1D557}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", Gamma: "\u0393", gamma: "\u03B3", Gammad: "\u03DC", gammad: "\u03DD", gap: "\u2A86", Gbreve: "\u011E", gbreve: "\u011F", Gcedil: "\u0122", Gcirc: "\u011C", gcirc: "\u011D", Gcy: "\u0413", gcy: "\u0433", Gdot: "\u0120", gdot: "\u0121", ge: "\u2265", gE: "\u2267", gEl: "\u2A8C", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", gescc: "\u2AA9", ges: "\u2A7E", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", Gfr: "\u{1D50A}", gfr: "\u{1D524}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", GJcy: "\u0403", gjcy: "\u0453", gla: "\u2AA5", gl: "\u2277", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", Gopf: "\u{1D53E}", gopf: "\u{1D558}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gt: ">", GT: ">", Gt: "\u226B", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", HARDcy: "\u042A", hardcy: "\u044A", harrcir: "\u2948", harr: "\u2194", hArr: "\u21D4", harrw: "\u21AD", Hat: "^", hbar: "\u210F", Hcirc: "\u0124", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", Hstrok: "\u0126", hstrok: "\u0127", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", Iacute: "\xCD", iacute: "\xED", ic: "\u2063", Icirc: "\xCE", icirc: "\xEE", Icy: "\u0418", icy: "\u0438", Idot: "\u0130", IEcy: "\u0415", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", Igrave: "\xCC", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", IJlig: "\u0132", ijlig: "\u0133", Imacr: "\u012A", imacr: "\u012B", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", Im: "\u2111", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", incare: "\u2105", in: "\u2208", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", intcal: "\u22BA", int: "\u222B", Int: "\u222C", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "\u0401", iocy: "\u0451", Iogon: "\u012E", iogon: "\u012F", Iopf: "\u{1D540}", iopf: "\u{1D55A}", Iota: "\u0399", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", Itilde: "\u0128", itilde: "\u0129", Iukcy: "\u0406", iukcy: "\u0456", Iuml: "\xCF", iuml: "\xEF", Jcirc: "\u0134", jcirc: "\u0135", Jcy: "\u0419", jcy: "\u0439", Jfr: "\u{1D50D}", jfr: "\u{1D527}", jmath: "\u0237", Jopf: "\u{1D541}", jopf: "\u{1D55B}", Jscr: "\u{1D4A5}", jscr: "\u{1D4BF}", Jsercy: "\u0408", jsercy: "\u0458", Jukcy: "\u0404", jukcy: "\u0454", Kappa: "\u039A", kappa: "\u03BA", kappav: "\u03F0", Kcedil: "\u0136", kcedil: "\u0137", Kcy: "\u041A", kcy: "\u043A", Kfr: "\u{1D50E}", kfr: "\u{1D528}", kgreen: "\u0138", KHcy: "\u0425", khcy: "\u0445", KJcy: "\u040C", kjcy: "\u045C", Kopf: "\u{1D542}", kopf: "\u{1D55C}", Kscr: "\u{1D4A6}", kscr: "\u{1D4C0}", lAarr: "\u21DA", Lacute: "\u0139", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", Lambda: "\u039B", lambda: "\u03BB", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larrb: "\u21E4", larrbfs: "\u291F", larr: "\u2190", Larr: "\u219E", lArr: "\u21D0", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", latail: "\u2919", lAtail: "\u291B", lat: "\u2AAB", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", Lcaron: "\u013D", lcaron: "\u013E", Lcedil: "\u013B", lcedil: "\u013C", lceil: "\u2308", lcub: "{", Lcy: "\u041B", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", LeftArrowBar: "\u21E4", leftarrow: "\u2190", LeftArrow: "\u2190", Leftarrow: "\u21D0", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVectorBar: "\u2959", LeftDownVector: "\u21C3", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", LeftRightArrow: "\u2194", Leftrightarrow: "\u21D4", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTeeArrow: "\u21A4", LeftTee: "\u22A3", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangleBar: "\u29CF", LeftTriangle: "\u22B2", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVectorBar: "\u2958", LeftUpVector: "\u21BF", LeftVectorBar: "\u2952", LeftVector: "\u21BC", lEg: "\u2A8B", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", lescc: "\u2AA8", les: "\u2A7D", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", Lfr: "\u{1D50F}", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", LJcy: "\u0409", ljcy: "\u0459", llarr: "\u21C7", ll: "\u226A", Ll: "\u22D8", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", Lmidot: "\u013F", lmidot: "\u0140", lmoustache: "\u23B0", lmoust: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", LongLeftArrow: "\u27F5", Longleftarrow: "\u27F8", longleftrightarrow: "\u27F7", LongLeftRightArrow: "\u27F7", Longleftrightarrow: "\u27FA", longmapsto: "\u27FC", longrightarrow: "\u27F6", LongRightArrow: "\u27F6", Longrightarrow: "\u27F9", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", Lopf: "\u{1D543}", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", Lstrok: "\u0141", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", lt: "<", LT: "<", Lt: "\u226A", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", Map: "\u2905", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", Mcy: "\u041C", mcy: "\u043C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midast: "*", midcir: "\u2AF0", mid: "\u2223", middot: "\xB7", minusb: "\u229F", minus: "\u2212", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", Mopf: "\u{1D544}", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", Mu: "\u039C", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", Nacute: "\u0143", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natural: "\u266E", naturals: "\u2115", natur: "\u266E", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", Ncaron: "\u0147", ncaron: "\u0148", Ncedil: "\u0145", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", Ncy: "\u041D", ncy: "\u043D", ndash: "\u2013", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", ne: "\u2260", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", Nfr: "\u{1D511}", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", nGt: "\u226B\u20D2", ngt: "\u226F", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", NJcy: "\u040A", njcy: "\u045A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nlE: "\u2266\u0338", nle: "\u2270", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nLt: "\u226A\u20D2", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", Not: "\u2AEC", not: "\xAC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangle: "\u22EB", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", nparallel: "\u2226", npar: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", nprec: "\u2280", npreceq: "\u2AAF\u0338", npre: "\u2AAF\u0338", nrarrc: "\u2933\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", Nscr: "\u{1D4A9}", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", Ntilde: "\xD1", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", Nu: "\u039D", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", Oacute: "\xD3", oacute: "\xF3", oast: "\u229B", Ocirc: "\xD4", ocirc: "\xF4", ocir: "\u229A", Ocy: "\u041E", ocy: "\u043E", odash: "\u229D", Odblac: "\u0150", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", OElig: "\u0152", oelig: "\u0153", ofcir: "\u29BF", Ofr: "\u{1D512}", ofr: "\u{1D52C}", ogon: "\u02DB", Ograve: "\xD2", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", Omacr: "\u014C", omacr: "\u014D", Omega: "\u03A9", omega: "\u03C9", Omicron: "\u039F", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", Oopf: "\u{1D546}", oopf: "\u{1D560}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", orarr: "\u21BB", Or: "\u2A54", or: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", Oscr: "\u{1D4AA}", oscr: "\u2134", Oslash: "\xD8", oslash: "\xF8", osol: "\u2298", Otilde: "\xD5", otilde: "\xF5", otimesas: "\u2A36", Otimes: "\u2A37", otimes: "\u2297", Ouml: "\xD6", ouml: "\xF6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", para: "\xB6", parallel: "\u2225", par: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", Pcy: "\u041F", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", Pfr: "\u{1D513}", pfr: "\u{1D52D}", Phi: "\u03A6", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", Pi: "\u03A0", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plus: "+", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", prap: "\u2AB7", Pr: "\u2ABB", pr: "\u227A", prcue: "\u227C", precapprox: "\u2AB7", prec: "\u227A", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", pre: "\u2AAF", prE: "\u2AB3", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportional: "\u221D", Proportion: "\u2237", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", Pscr: "\u{1D4AB}", pscr: "\u{1D4C5}", Psi: "\u03A8", psi: "\u03C8", puncsp: "\u2008", Qfr: "\u{1D514}", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", Qscr: "\u{1D4AC}", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", Racute: "\u0154", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarr: "\u2192", Rarr: "\u21A0", rArr: "\u21D2", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", Rarrtl: "\u2916", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", Rcaron: "\u0158", rcaron: "\u0159", Rcedil: "\u0156", rcedil: "\u0157", rceil: "\u2309", rcub: "}", Rcy: "\u0420", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", Re: "\u211C", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", Rho: "\u03A1", rho: "\u03C1", rhov: "\u03F1", RightAngleBracket: "\u27E9", RightArrowBar: "\u21E5", rightarrow: "\u2192", RightArrow: "\u2192", Rightarrow: "\u21D2", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVectorBar: "\u2955", RightDownVector: "\u21C2", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTeeArrow: "\u21A6", RightTee: "\u22A2", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangleBar: "\u29D0", RightTriangle: "\u22B3", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVectorBar: "\u2954", RightUpVector: "\u21BE", RightVectorBar: "\u2953", RightVector: "\u21C0", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoustache: "\u23B1", rmoust: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", Sacute: "\u015A", sacute: "\u015B", sbquo: "\u201A", scap: "\u2AB8", Scaron: "\u0160", scaron: "\u0161", Sc: "\u2ABC", sc: "\u227B", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", Scedil: "\u015E", scedil: "\u015F", Scirc: "\u015C", scirc: "\u015D", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", Scy: "\u0421", scy: "\u0441", sdotb: "\u22A1", sdot: "\u22C5", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", Sfr: "\u{1D516}", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", SHCHcy: "\u0429", shchcy: "\u0449", SHcy: "\u0428", shcy: "\u0448", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", Sigma: "\u03A3", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", SOFTcy: "\u042C", softcy: "\u044C", solbar: "\u233F", solb: "\u29C4", sol: "/", Sopf: "\u{1D54A}", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squ: "\u25A1", squf: "\u25AA", srarr: "\u2192", Sscr: "\u{1D4AE}", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", Star: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", subE: "\u2AC5", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succapprox: "\u2AB8", succ: "\u227B", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", Sup: "\u22D1", supdot: "\u2ABE", supdsub: "\u2AD8", supE: "\u2AC6", supe: "\u2287", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", Tau: "\u03A4", tau: "\u03C4", tbrk: "\u23B4", Tcaron: "\u0164", tcaron: "\u0165", Tcedil: "\u0162", tcedil: "\u0163", Tcy: "\u0422", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", Tfr: "\u{1D517}", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", Theta: "\u0398", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", THORN: "\xDE", thorn: "\xFE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", timesbar: "\u2A31", timesb: "\u22A0", times: "\xD7", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", topbot: "\u2336", topcir: "\u2AF1", top: "\u22A4", Topf: "\u{1D54B}", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", Tscr: "\u{1D4AF}", tscr: "\u{1D4C9}", TScy: "\u0426", tscy: "\u0446", TSHcy: "\u040B", tshcy: "\u045B", Tstrok: "\u0166", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", Uacute: "\xDA", uacute: "\xFA", uarr: "\u2191", Uarr: "\u219F", uArr: "\u21D1", Uarrocir: "\u2949", Ubrcy: "\u040E", ubrcy: "\u045E", Ubreve: "\u016C", ubreve: "\u016D", Ucirc: "\xDB", ucirc: "\xFB", Ucy: "\u0423", ucy: "\u0443", udarr: "\u21C5", Udblac: "\u0170", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", Ufr: "\u{1D518}", ufr: "\u{1D532}", Ugrave: "\xD9", ugrave: "\xF9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", Umacr: "\u016A", umacr: "\u016B", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", uogon: "\u0173", Uopf: "\u{1D54C}", uopf: "\u{1D566}", UpArrowBar: "\u2912", uparrow: "\u2191", UpArrow: "\u2191", Uparrow: "\u21D1", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", UpDownArrow: "\u2195", Updownarrow: "\u21D5", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", upsilon: "\u03C5", UpTeeArrow: "\u21A5", UpTee: "\u22A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", Uring: "\u016E", uring: "\u016F", urtri: "\u25F9", Uscr: "\u{1D4B0}", uscr: "\u{1D4CA}", utdot: "\u22F0", Utilde: "\u0168", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", Uuml: "\xDC", uuml: "\xFC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", Vcy: "\u0412", vcy: "\u0432", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", veebar: "\u22BB", vee: "\u2228", Vee: "\u22C1", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", Vopf: "\u{1D54D}", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", Vscr: "\u{1D4B1}", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", Wcirc: "\u0174", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", Wfr: "\u{1D51A}", wfr: "\u{1D534}", Wopf: "\u{1D54E}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", Wscr: "\u{1D4B2}", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", Xfr: "\u{1D51B}", xfr: "\u{1D535}", xharr: "\u27F7", xhArr: "\u27FA", Xi: "\u039E", xi: "\u03BE", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", Xopf: "\u{1D54F}", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", Xscr: "\u{1D4B3}", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", Yacute: "\xDD", yacute: "\xFD", YAcy: "\u042F", yacy: "\u044F", Ycirc: "\u0176", ycirc: "\u0177", Ycy: "\u042B", ycy: "\u044B", yen: "\xA5", Yfr: "\u{1D51C}", yfr: "\u{1D536}", YIcy: "\u0407", yicy: "\u0457", Yopf: "\u{1D550}", yopf: "\u{1D56A}", Yscr: "\u{1D4B4}", yscr: "\u{1D4CE}", YUcy: "\u042E", yucy: "\u044E", yuml: "\xFF", Yuml: "\u0178", Zacute: "\u0179", zacute: "\u017A", Zcaron: "\u017D", zcaron: "\u017E", Zcy: "\u0417", zcy: "\u0437", Zdot: "\u017B", zdot: "\u017C", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", Zeta: "\u0396", zeta: "\u03B6", zfr: "\u{1D537}", Zfr: "\u2128", ZHcy: "\u0416", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", Zscr: "\u{1D4B5}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
    }
  });

  // ../../node_modules/markdown-it/lib/common/entities.js
  var require_entities2 = __commonJS({
    "../../node_modules/markdown-it/lib/common/entities.js"(exports, module) {
      "use strict";
      module.exports = require_entities();
    }
  });

  // ../../node_modules/uc.micro/categories/P/regex.js
  var require_regex = __commonJS({
    "../../node_modules/uc.micro/categories/P/regex.js"(exports, module) {
      module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
    }
  });

  // ../../node_modules/mdurl/encode.js
  var require_encode = __commonJS({
    "../../node_modules/mdurl/encode.js"(exports, module) {
      "use strict";
      var encodeCache = {};
      function getEncodeCache(exclude) {
        var i, ch, cache = encodeCache[exclude];
        if (cache) {
          return cache;
        }
        cache = encodeCache[exclude] = [];
        for (i = 0; i < 128; i++) {
          ch = String.fromCharCode(i);
          if (/^[0-9a-z]$/i.test(ch)) {
            cache.push(ch);
          } else {
            cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
          }
        }
        for (i = 0; i < exclude.length; i++) {
          cache[exclude.charCodeAt(i)] = exclude[i];
        }
        return cache;
      }
      function encode2(string, exclude, keepEscaped) {
        var i, l, code, nextCode, cache, result = "";
        if (typeof exclude !== "string") {
          keepEscaped = exclude;
          exclude = encode2.defaultChars;
        }
        if (typeof keepEscaped === "undefined") {
          keepEscaped = true;
        }
        cache = getEncodeCache(exclude);
        for (i = 0, l = string.length; i < l; i++) {
          code = string.charCodeAt(i);
          if (keepEscaped && code === 37 && i + 2 < l) {
            if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
              result += string.slice(i, i + 3);
              i += 2;
              continue;
            }
          }
          if (code < 128) {
            result += cache[code];
            continue;
          }
          if (code >= 55296 && code <= 57343) {
            if (code >= 55296 && code <= 56319 && i + 1 < l) {
              nextCode = string.charCodeAt(i + 1);
              if (nextCode >= 56320 && nextCode <= 57343) {
                result += encodeURIComponent(string[i] + string[i + 1]);
                i++;
                continue;
              }
            }
            result += "%EF%BF%BD";
            continue;
          }
          result += encodeURIComponent(string[i]);
        }
        return result;
      }
      encode2.defaultChars = ";/?:@&=+$,-_.!~*'()#";
      encode2.componentChars = "-_.!~*'()";
      module.exports = encode2;
    }
  });

  // ../../node_modules/mdurl/decode.js
  var require_decode = __commonJS({
    "../../node_modules/mdurl/decode.js"(exports, module) {
      "use strict";
      var decodeCache = {};
      function getDecodeCache(exclude) {
        var i, ch, cache = decodeCache[exclude];
        if (cache) {
          return cache;
        }
        cache = decodeCache[exclude] = [];
        for (i = 0; i < 128; i++) {
          ch = String.fromCharCode(i);
          cache.push(ch);
        }
        for (i = 0; i < exclude.length; i++) {
          ch = exclude.charCodeAt(i);
          cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
        }
        return cache;
      }
      function decode2(string, exclude) {
        var cache;
        if (typeof exclude !== "string") {
          exclude = decode2.defaultChars;
        }
        cache = getDecodeCache(exclude);
        return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
          var i, l, b1, b2, b3, b4, chr, result = "";
          for (i = 0, l = seq.length; i < l; i += 3) {
            b1 = parseInt(seq.slice(i + 1, i + 3), 16);
            if (b1 < 128) {
              result += cache[b1];
              continue;
            }
            if ((b1 & 224) === 192 && i + 3 < l) {
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              if ((b2 & 192) === 128) {
                chr = b1 << 6 & 1984 | b2 & 63;
                if (chr < 128) {
                  result += "\uFFFD\uFFFD";
                } else {
                  result += String.fromCharCode(chr);
                }
                i += 3;
                continue;
              }
            }
            if ((b1 & 240) === 224 && i + 6 < l) {
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              b3 = parseInt(seq.slice(i + 7, i + 9), 16);
              if ((b2 & 192) === 128 && (b3 & 192) === 128) {
                chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
                if (chr < 2048 || chr >= 55296 && chr <= 57343) {
                  result += "\uFFFD\uFFFD\uFFFD";
                } else {
                  result += String.fromCharCode(chr);
                }
                i += 6;
                continue;
              }
            }
            if ((b1 & 248) === 240 && i + 9 < l) {
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              b3 = parseInt(seq.slice(i + 7, i + 9), 16);
              b4 = parseInt(seq.slice(i + 10, i + 12), 16);
              if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
                chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
                if (chr < 65536 || chr > 1114111) {
                  result += "\uFFFD\uFFFD\uFFFD\uFFFD";
                } else {
                  chr -= 65536;
                  result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
                }
                i += 9;
                continue;
              }
            }
            result += "\uFFFD";
          }
          return result;
        });
      }
      decode2.defaultChars = ";/?:@&=+$,#";
      decode2.componentChars = "";
      module.exports = decode2;
    }
  });

  // ../../node_modules/mdurl/format.js
  var require_format = __commonJS({
    "../../node_modules/mdurl/format.js"(exports, module) {
      "use strict";
      module.exports = function format(url) {
        var result = "";
        result += url.protocol || "";
        result += url.slashes ? "//" : "";
        result += url.auth ? url.auth + "@" : "";
        if (url.hostname && url.hostname.indexOf(":") !== -1) {
          result += "[" + url.hostname + "]";
        } else {
          result += url.hostname || "";
        }
        result += url.port ? ":" + url.port : "";
        result += url.pathname || "";
        result += url.search || "";
        result += url.hash || "";
        return result;
      };
    }
  });

  // ../../node_modules/mdurl/parse.js
  var require_parse = __commonJS({
    "../../node_modules/mdurl/parse.js"(exports, module) {
      "use strict";
      function Url() {
        this.protocol = null;
        this.slashes = null;
        this.auth = null;
        this.port = null;
        this.hostname = null;
        this.hash = null;
        this.search = null;
        this.pathname = null;
      }
      var protocolPattern = /^([a-z0-9.+-]+:)/i;
      var portPattern = /:[0-9]*$/;
      var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
      var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
      var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
      var autoEscape = ["'"].concat(unwise);
      var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
      var hostEndingChars = ["/", "?", "#"];
      var hostnameMaxLen = 255;
      var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
      var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
      var hostlessProtocol = {
        "javascript": true,
        "javascript:": true
      };
      var slashedProtocol = {
        "http": true,
        "https": true,
        "ftp": true,
        "gopher": true,
        "file": true,
        "http:": true,
        "https:": true,
        "ftp:": true,
        "gopher:": true,
        "file:": true
      };
      function urlParse(url, slashesDenoteHost) {
        if (url && url instanceof Url) {
          return url;
        }
        var u = new Url();
        u.parse(url, slashesDenoteHost);
        return u;
      }
      Url.prototype.parse = function(url, slashesDenoteHost) {
        var i, l, lowerProto, hec, slashes, rest = url;
        rest = rest.trim();
        if (!slashesDenoteHost && url.split("#").length === 1) {
          var simplePath = simplePathPattern.exec(rest);
          if (simplePath) {
            this.pathname = simplePath[1];
            if (simplePath[2]) {
              this.search = simplePath[2];
            }
            return this;
          }
        }
        var proto = protocolPattern.exec(rest);
        if (proto) {
          proto = proto[0];
          lowerProto = proto.toLowerCase();
          this.protocol = proto;
          rest = rest.substr(proto.length);
        }
        if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
          slashes = rest.substr(0, 2) === "//";
          if (slashes && !(proto && hostlessProtocol[proto])) {
            rest = rest.substr(2);
            this.slashes = true;
          }
        }
        if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
          var hostEnd = -1;
          for (i = 0; i < hostEndingChars.length; i++) {
            hec = rest.indexOf(hostEndingChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          var auth, atSign;
          if (hostEnd === -1) {
            atSign = rest.lastIndexOf("@");
          } else {
            atSign = rest.lastIndexOf("@", hostEnd);
          }
          if (atSign !== -1) {
            auth = rest.slice(0, atSign);
            rest = rest.slice(atSign + 1);
            this.auth = auth;
          }
          hostEnd = -1;
          for (i = 0; i < nonHostChars.length; i++) {
            hec = rest.indexOf(nonHostChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          if (hostEnd === -1) {
            hostEnd = rest.length;
          }
          if (rest[hostEnd - 1] === ":") {
            hostEnd--;
          }
          var host = rest.slice(0, hostEnd);
          rest = rest.slice(hostEnd);
          this.parseHost(host);
          this.hostname = this.hostname || "";
          var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
          if (!ipv6Hostname) {
            var hostparts = this.hostname.split(/\./);
            for (i = 0, l = hostparts.length; i < l; i++) {
              var part = hostparts[i];
              if (!part) {
                continue;
              }
              if (!part.match(hostnamePartPattern)) {
                var newpart = "";
                for (var j = 0, k = part.length; j < k; j++) {
                  if (part.charCodeAt(j) > 127) {
                    newpart += "x";
                  } else {
                    newpart += part[j];
                  }
                }
                if (!newpart.match(hostnamePartPattern)) {
                  var validParts = hostparts.slice(0, i);
                  var notHost = hostparts.slice(i + 1);
                  var bit = part.match(hostnamePartStart);
                  if (bit) {
                    validParts.push(bit[1]);
                    notHost.unshift(bit[2]);
                  }
                  if (notHost.length) {
                    rest = notHost.join(".") + rest;
                  }
                  this.hostname = validParts.join(".");
                  break;
                }
              }
            }
          }
          if (this.hostname.length > hostnameMaxLen) {
            this.hostname = "";
          }
          if (ipv6Hostname) {
            this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          }
        }
        var hash = rest.indexOf("#");
        if (hash !== -1) {
          this.hash = rest.substr(hash);
          rest = rest.slice(0, hash);
        }
        var qm = rest.indexOf("?");
        if (qm !== -1) {
          this.search = rest.substr(qm);
          rest = rest.slice(0, qm);
        }
        if (rest) {
          this.pathname = rest;
        }
        if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
          this.pathname = "";
        }
        return this;
      };
      Url.prototype.parseHost = function(host) {
        var port = portPattern.exec(host);
        if (port) {
          port = port[0];
          if (port !== ":") {
            this.port = port.substr(1);
          }
          host = host.substr(0, host.length - port.length);
        }
        if (host) {
          this.hostname = host;
        }
      };
      module.exports = urlParse;
    }
  });

  // ../../node_modules/mdurl/index.js
  var require_mdurl = __commonJS({
    "../../node_modules/mdurl/index.js"(exports, module) {
      "use strict";
      module.exports.encode = require_encode();
      module.exports.decode = require_decode();
      module.exports.format = require_format();
      module.exports.parse = require_parse();
    }
  });

  // ../../node_modules/uc.micro/properties/Any/regex.js
  var require_regex2 = __commonJS({
    "../../node_modules/uc.micro/properties/Any/regex.js"(exports, module) {
      module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    }
  });

  // ../../node_modules/uc.micro/categories/Cc/regex.js
  var require_regex3 = __commonJS({
    "../../node_modules/uc.micro/categories/Cc/regex.js"(exports, module) {
      module.exports = /[\0-\x1F\x7F-\x9F]/;
    }
  });

  // ../../node_modules/uc.micro/categories/Cf/regex.js
  var require_regex4 = __commonJS({
    "../../node_modules/uc.micro/categories/Cf/regex.js"(exports, module) {
      module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
    }
  });

  // ../../node_modules/uc.micro/categories/Z/regex.js
  var require_regex5 = __commonJS({
    "../../node_modules/uc.micro/categories/Z/regex.js"(exports, module) {
      module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
    }
  });

  // ../../node_modules/uc.micro/index.js
  var require_uc = __commonJS({
    "../../node_modules/uc.micro/index.js"(exports) {
      "use strict";
      exports.Any = require_regex2();
      exports.Cc = require_regex3();
      exports.Cf = require_regex4();
      exports.P = require_regex();
      exports.Z = require_regex5();
    }
  });

  // ../../node_modules/markdown-it/lib/common/utils.js
  var require_utils = __commonJS({
    "../../node_modules/markdown-it/lib/common/utils.js"(exports) {
      "use strict";
      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }
      function isString(obj) {
        return _class(obj) === "[object String]";
      }
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      function has(object, key) {
        return _hasOwnProperty.call(object, key);
      }
      function assign(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(source) {
          if (!source) {
            return;
          }
          if (typeof source !== "object") {
            throw new TypeError(source + "must be object");
          }
          Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
          });
        });
        return obj;
      }
      function arrayReplaceAt(src, pos, newElements) {
        return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
      }
      function isValidEntityCode(c) {
        if (c >= 55296 && c <= 57343) {
          return false;
        }
        if (c >= 64976 && c <= 65007) {
          return false;
        }
        if ((c & 65535) === 65535 || (c & 65535) === 65534) {
          return false;
        }
        if (c >= 0 && c <= 8) {
          return false;
        }
        if (c === 11) {
          return false;
        }
        if (c >= 14 && c <= 31) {
          return false;
        }
        if (c >= 127 && c <= 159) {
          return false;
        }
        if (c > 1114111) {
          return false;
        }
        return true;
      }
      function fromCodePoint(c) {
        if (c > 65535) {
          c -= 65536;
          var surrogate1 = 55296 + (c >> 10), surrogate2 = 56320 + (c & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        }
        return String.fromCharCode(c);
      }
      var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
      var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
      var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
      var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;
      var entities = require_entities2();
      function replaceEntityPattern(match, name) {
        var code = 0;
        if (has(entities, name)) {
          return entities[name];
        }
        if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
          code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
          if (isValidEntityCode(code)) {
            return fromCodePoint(code);
          }
        }
        return match;
      }
      function unescapeMd(str) {
        if (str.indexOf("\\") < 0) {
          return str;
        }
        return str.replace(UNESCAPE_MD_RE, "$1");
      }
      function unescapeAll(str) {
        if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) {
          return str;
        }
        return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
          if (escaped) {
            return escaped;
          }
          return replaceEntityPattern(match, entity);
        });
      }
      var HTML_ESCAPE_TEST_RE = /[&<>"]/;
      var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
      var HTML_REPLACEMENTS = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      };
      function replaceUnsafeChar(ch) {
        return HTML_REPLACEMENTS[ch];
      }
      function escapeHtml(str) {
        if (HTML_ESCAPE_TEST_RE.test(str)) {
          return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
        }
        return str;
      }
      var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
      function escapeRE(str) {
        return str.replace(REGEXP_ESCAPE_RE, "\\$&");
      }
      function isSpace(code) {
        switch (code) {
          case 9:
          case 32:
            return true;
        }
        return false;
      }
      function isWhiteSpace(code) {
        if (code >= 8192 && code <= 8202) {
          return true;
        }
        switch (code) {
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 32:
          case 160:
          case 5760:
          case 8239:
          case 8287:
          case 12288:
            return true;
        }
        return false;
      }
      var UNICODE_PUNCT_RE = require_regex();
      function isPunctChar(ch) {
        return UNICODE_PUNCT_RE.test(ch);
      }
      function isMdAsciiPunct(ch) {
        switch (ch) {
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
          case 58:
          case 59:
          case 60:
          case 61:
          case 62:
          case 63:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 124:
          case 125:
          case 126:
            return true;
          default:
            return false;
        }
      }
      function normalizeReference(str) {
        str = str.trim().replace(/\s+/g, " ");
        if ("\u1E9E".toLowerCase() === "\u1E7E") {
          str = str.replace(/ẞ/g, "\xDF");
        }
        return str.toLowerCase().toUpperCase();
      }
      exports.lib = {};
      exports.lib.mdurl = require_mdurl();
      exports.lib.ucmicro = require_uc();
      exports.assign = assign;
      exports.isString = isString;
      exports.has = has;
      exports.unescapeMd = unescapeMd;
      exports.unescapeAll = unescapeAll;
      exports.isValidEntityCode = isValidEntityCode;
      exports.fromCodePoint = fromCodePoint;
      exports.escapeHtml = escapeHtml;
      exports.arrayReplaceAt = arrayReplaceAt;
      exports.isSpace = isSpace;
      exports.isWhiteSpace = isWhiteSpace;
      exports.isMdAsciiPunct = isMdAsciiPunct;
      exports.isPunctChar = isPunctChar;
      exports.escapeRE = escapeRE;
      exports.normalizeReference = normalizeReference;
    }
  });

  // ../../node_modules/markdown-it/lib/helpers/parse_link_label.js
  var require_parse_link_label = __commonJS({
    "../../node_modules/markdown-it/lib/helpers/parse_link_label.js"(exports, module) {
      "use strict";
      module.exports = function parseLinkLabel(state, start, disableNested) {
        var level, found, marker, prevPos, labelEnd = -1, max = state.posMax, oldPos = state.pos;
        state.pos = start + 1;
        level = 1;
        while (state.pos < max) {
          marker = state.src.charCodeAt(state.pos);
          if (marker === 93) {
            level--;
            if (level === 0) {
              found = true;
              break;
            }
          }
          prevPos = state.pos;
          state.md.inline.skipToken(state);
          if (marker === 91) {
            if (prevPos === state.pos - 1) {
              level++;
            } else if (disableNested) {
              state.pos = oldPos;
              return -1;
            }
          }
        }
        if (found) {
          labelEnd = state.pos;
        }
        state.pos = oldPos;
        return labelEnd;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/helpers/parse_link_destination.js
  var require_parse_link_destination = __commonJS({
    "../../node_modules/markdown-it/lib/helpers/parse_link_destination.js"(exports, module) {
      "use strict";
      var unescapeAll = require_utils().unescapeAll;
      module.exports = function parseLinkDestination(str, pos, max) {
        var code, level, lines = 0, start = pos, result = {
          ok: false,
          pos: 0,
          lines: 0,
          str: ""
        };
        if (str.charCodeAt(pos) === 60) {
          pos++;
          while (pos < max) {
            code = str.charCodeAt(pos);
            if (code === 10) {
              return result;
            }
            if (code === 60) {
              return result;
            }
            if (code === 62) {
              result.pos = pos + 1;
              result.str = unescapeAll(str.slice(start + 1, pos));
              result.ok = true;
              return result;
            }
            if (code === 92 && pos + 1 < max) {
              pos += 2;
              continue;
            }
            pos++;
          }
          return result;
        }
        level = 0;
        while (pos < max) {
          code = str.charCodeAt(pos);
          if (code === 32) {
            break;
          }
          if (code < 32 || code === 127) {
            break;
          }
          if (code === 92 && pos + 1 < max) {
            if (str.charCodeAt(pos + 1) === 32) {
              break;
            }
            pos += 2;
            continue;
          }
          if (code === 40) {
            level++;
            if (level > 32) {
              return result;
            }
          }
          if (code === 41) {
            if (level === 0) {
              break;
            }
            level--;
          }
          pos++;
        }
        if (start === pos) {
          return result;
        }
        if (level !== 0) {
          return result;
        }
        result.str = unescapeAll(str.slice(start, pos));
        result.lines = lines;
        result.pos = pos;
        result.ok = true;
        return result;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/helpers/parse_link_title.js
  var require_parse_link_title = __commonJS({
    "../../node_modules/markdown-it/lib/helpers/parse_link_title.js"(exports, module) {
      "use strict";
      var unescapeAll = require_utils().unescapeAll;
      module.exports = function parseLinkTitle(str, pos, max) {
        var code, marker, lines = 0, start = pos, result = {
          ok: false,
          pos: 0,
          lines: 0,
          str: ""
        };
        if (pos >= max) {
          return result;
        }
        marker = str.charCodeAt(pos);
        if (marker !== 34 && marker !== 39 && marker !== 40) {
          return result;
        }
        pos++;
        if (marker === 40) {
          marker = 41;
        }
        while (pos < max) {
          code = str.charCodeAt(pos);
          if (code === marker) {
            result.pos = pos + 1;
            result.lines = lines;
            result.str = unescapeAll(str.slice(start + 1, pos));
            result.ok = true;
            return result;
          } else if (code === 40 && marker === 41) {
            return result;
          } else if (code === 10) {
            lines++;
          } else if (code === 92 && pos + 1 < max) {
            pos++;
            if (str.charCodeAt(pos) === 10) {
              lines++;
            }
          }
          pos++;
        }
        return result;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/helpers/index.js
  var require_helpers = __commonJS({
    "../../node_modules/markdown-it/lib/helpers/index.js"(exports) {
      "use strict";
      exports.parseLinkLabel = require_parse_link_label();
      exports.parseLinkDestination = require_parse_link_destination();
      exports.parseLinkTitle = require_parse_link_title();
    }
  });

  // ../../node_modules/markdown-it/lib/renderer.js
  var require_renderer = __commonJS({
    "../../node_modules/markdown-it/lib/renderer.js"(exports, module) {
      "use strict";
      var assign = require_utils().assign;
      var unescapeAll = require_utils().unescapeAll;
      var escapeHtml = require_utils().escapeHtml;
      var default_rules = {};
      default_rules.code_inline = function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return "<code" + slf.renderAttrs(token) + ">" + escapeHtml(tokens[idx].content) + "</code>";
      };
      default_rules.code_block = function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
      };
      default_rules.fence = function(tokens, idx, options, env, slf) {
        var token = tokens[idx], info = token.info ? unescapeAll(token.info).trim() : "", langName = "", langAttrs = "", highlighted, i, arr, tmpAttrs, tmpToken;
        if (info) {
          arr = info.split(/(\s+)/g);
          langName = arr[0];
          langAttrs = arr.slice(2).join("");
        }
        if (options.highlight) {
          highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
        } else {
          highlighted = escapeHtml(token.content);
        }
        if (highlighted.indexOf("<pre") === 0) {
          return highlighted + "\n";
        }
        if (info) {
          i = token.attrIndex("class");
          tmpAttrs = token.attrs ? token.attrs.slice() : [];
          if (i < 0) {
            tmpAttrs.push(["class", options.langPrefix + langName]);
          } else {
            tmpAttrs[i] = tmpAttrs[i].slice();
            tmpAttrs[i][1] += " " + options.langPrefix + langName;
          }
          tmpToken = {
            attrs: tmpAttrs
          };
          return "<pre><code" + slf.renderAttrs(tmpToken) + ">" + highlighted + "</code></pre>\n";
        }
        return "<pre><code" + slf.renderAttrs(token) + ">" + highlighted + "</code></pre>\n";
      };
      default_rules.image = function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
        return slf.renderToken(tokens, idx, options);
      };
      default_rules.hardbreak = function(tokens, idx, options) {
        return options.xhtmlOut ? "<br />\n" : "<br>\n";
      };
      default_rules.softbreak = function(tokens, idx, options) {
        return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
      };
      default_rules.text = function(tokens, idx) {
        return escapeHtml(tokens[idx].content);
      };
      default_rules.html_block = function(tokens, idx) {
        return tokens[idx].content;
      };
      default_rules.html_inline = function(tokens, idx) {
        return tokens[idx].content;
      };
      function Renderer() {
        this.rules = assign({}, default_rules);
      }
      Renderer.prototype.renderAttrs = function renderAttrs(token) {
        var i, l, result;
        if (!token.attrs) {
          return "";
        }
        result = "";
        for (i = 0, l = token.attrs.length; i < l; i++) {
          result += " " + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
        }
        return result;
      };
      Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
        var nextToken, result = "", needLf = false, token = tokens[idx];
        if (token.hidden) {
          return "";
        }
        if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
          result += "\n";
        }
        result += (token.nesting === -1 ? "</" : "<") + token.tag;
        result += this.renderAttrs(token);
        if (token.nesting === 0 && options.xhtmlOut) {
          result += " /";
        }
        if (token.block) {
          needLf = true;
          if (token.nesting === 1) {
            if (idx + 1 < tokens.length) {
              nextToken = tokens[idx + 1];
              if (nextToken.type === "inline" || nextToken.hidden) {
                needLf = false;
              } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
                needLf = false;
              }
            }
          }
        }
        result += needLf ? ">\n" : ">";
        return result;
      };
      Renderer.prototype.renderInline = function(tokens, options, env) {
        var type, result = "", rules = this.rules;
        for (var i = 0, len = tokens.length; i < len; i++) {
          type = tokens[i].type;
          if (typeof rules[type] !== "undefined") {
            result += rules[type](tokens, i, options, env, this);
          } else {
            result += this.renderToken(tokens, i, options);
          }
        }
        return result;
      };
      Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
        var result = "";
        for (var i = 0, len = tokens.length; i < len; i++) {
          if (tokens[i].type === "text") {
            result += tokens[i].content;
          } else if (tokens[i].type === "image") {
            result += this.renderInlineAsText(tokens[i].children, options, env);
          } else if (tokens[i].type === "softbreak") {
            result += "\n";
          }
        }
        return result;
      };
      Renderer.prototype.render = function(tokens, options, env) {
        var i, len, type, result = "", rules = this.rules;
        for (i = 0, len = tokens.length; i < len; i++) {
          type = tokens[i].type;
          if (type === "inline") {
            result += this.renderInline(tokens[i].children, options, env);
          } else if (typeof rules[type] !== "undefined") {
            result += rules[tokens[i].type](tokens, i, options, env, this);
          } else {
            result += this.renderToken(tokens, i, options, env);
          }
        }
        return result;
      };
      module.exports = Renderer;
    }
  });

  // ../../node_modules/markdown-it/lib/ruler.js
  var require_ruler = __commonJS({
    "../../node_modules/markdown-it/lib/ruler.js"(exports, module) {
      "use strict";
      function Ruler() {
        this.__rules__ = [];
        this.__cache__ = null;
      }
      Ruler.prototype.__find__ = function(name) {
        for (var i = 0; i < this.__rules__.length; i++) {
          if (this.__rules__[i].name === name) {
            return i;
          }
        }
        return -1;
      };
      Ruler.prototype.__compile__ = function() {
        var self = this;
        var chains = [""];
        self.__rules__.forEach(function(rule) {
          if (!rule.enabled) {
            return;
          }
          rule.alt.forEach(function(altName) {
            if (chains.indexOf(altName) < 0) {
              chains.push(altName);
            }
          });
        });
        self.__cache__ = {};
        chains.forEach(function(chain) {
          self.__cache__[chain] = [];
          self.__rules__.forEach(function(rule) {
            if (!rule.enabled) {
              return;
            }
            if (chain && rule.alt.indexOf(chain) < 0) {
              return;
            }
            self.__cache__[chain].push(rule.fn);
          });
        });
      };
      Ruler.prototype.at = function(name, fn, options) {
        var index = this.__find__(name);
        var opt = options || {};
        if (index === -1) {
          throw new Error("Parser rule not found: " + name);
        }
        this.__rules__[index].fn = fn;
        this.__rules__[index].alt = opt.alt || [];
        this.__cache__ = null;
      };
      Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
        var index = this.__find__(beforeName);
        var opt = options || {};
        if (index === -1) {
          throw new Error("Parser rule not found: " + beforeName);
        }
        this.__rules__.splice(index, 0, {
          name: ruleName,
          enabled: true,
          fn,
          alt: opt.alt || []
        });
        this.__cache__ = null;
      };
      Ruler.prototype.after = function(afterName, ruleName, fn, options) {
        var index = this.__find__(afterName);
        var opt = options || {};
        if (index === -1) {
          throw new Error("Parser rule not found: " + afterName);
        }
        this.__rules__.splice(index + 1, 0, {
          name: ruleName,
          enabled: true,
          fn,
          alt: opt.alt || []
        });
        this.__cache__ = null;
      };
      Ruler.prototype.push = function(ruleName, fn, options) {
        var opt = options || {};
        this.__rules__.push({
          name: ruleName,
          enabled: true,
          fn,
          alt: opt.alt || []
        });
        this.__cache__ = null;
      };
      Ruler.prototype.enable = function(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }
        var result = [];
        list.forEach(function(name) {
          var idx = this.__find__(name);
          if (idx < 0) {
            if (ignoreInvalid) {
              return;
            }
            throw new Error("Rules manager: invalid rule name " + name);
          }
          this.__rules__[idx].enabled = true;
          result.push(name);
        }, this);
        this.__cache__ = null;
        return result;
      };
      Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }
        this.__rules__.forEach(function(rule) {
          rule.enabled = false;
        });
        this.enable(list, ignoreInvalid);
      };
      Ruler.prototype.disable = function(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }
        var result = [];
        list.forEach(function(name) {
          var idx = this.__find__(name);
          if (idx < 0) {
            if (ignoreInvalid) {
              return;
            }
            throw new Error("Rules manager: invalid rule name " + name);
          }
          this.__rules__[idx].enabled = false;
          result.push(name);
        }, this);
        this.__cache__ = null;
        return result;
      };
      Ruler.prototype.getRules = function(chainName) {
        if (this.__cache__ === null) {
          this.__compile__();
        }
        return this.__cache__[chainName] || [];
      };
      module.exports = Ruler;
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/normalize.js
  var require_normalize = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/normalize.js"(exports, module) {
      "use strict";
      var NEWLINES_RE = /\r\n?|\n/g;
      var NULL_RE = /\0/g;
      module.exports = function normalize(state) {
        var str;
        str = state.src.replace(NEWLINES_RE, "\n");
        str = str.replace(NULL_RE, "\uFFFD");
        state.src = str;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/block.js
  var require_block = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/block.js"(exports, module) {
      "use strict";
      module.exports = function block(state) {
        var token;
        if (state.inlineMode) {
          token = new state.Token("inline", "", 0);
          token.content = state.src;
          token.map = [0, 1];
          token.children = [];
          state.tokens.push(token);
        } else {
          state.md.block.parse(state.src, state.md, state.env, state.tokens);
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/inline.js
  var require_inline = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/inline.js"(exports, module) {
      "use strict";
      module.exports = function inline(state) {
        var tokens = state.tokens, tok, i, l;
        for (i = 0, l = tokens.length; i < l; i++) {
          tok = tokens[i];
          if (tok.type === "inline") {
            state.md.inline.parse(tok.content, state.md, state.env, tok.children);
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/linkify.js
  var require_linkify = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/linkify.js"(exports, module) {
      "use strict";
      var arrayReplaceAt = require_utils().arrayReplaceAt;
      function isLinkOpen(str) {
        return /^<a[>\s]/i.test(str);
      }
      function isLinkClose(str) {
        return /^<\/a\s*>/i.test(str);
      }
      module.exports = function linkify(state) {
        var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos, level, htmlLinkLevel, url, fullUrl, urlText, blockTokens = state.tokens, links;
        if (!state.md.options.linkify) {
          return;
        }
        for (j = 0, l = blockTokens.length; j < l; j++) {
          if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) {
            continue;
          }
          tokens = blockTokens[j].children;
          htmlLinkLevel = 0;
          for (i = tokens.length - 1; i >= 0; i--) {
            currentToken = tokens[i];
            if (currentToken.type === "link_close") {
              i--;
              while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") {
                i--;
              }
              continue;
            }
            if (currentToken.type === "html_inline") {
              if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
                htmlLinkLevel--;
              }
              if (isLinkClose(currentToken.content)) {
                htmlLinkLevel++;
              }
            }
            if (htmlLinkLevel > 0) {
              continue;
            }
            if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
              text = currentToken.content;
              links = state.md.linkify.match(text);
              nodes = [];
              level = currentToken.level;
              lastPos = 0;
              for (ln = 0; ln < links.length; ln++) {
                url = links[ln].url;
                fullUrl = state.md.normalizeLink(url);
                if (!state.md.validateLink(fullUrl)) {
                  continue;
                }
                urlText = links[ln].text;
                if (!links[ln].schema) {
                  urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
                } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
                  urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
                } else {
                  urlText = state.md.normalizeLinkText(urlText);
                }
                pos = links[ln].index;
                if (pos > lastPos) {
                  token = new state.Token("text", "", 0);
                  token.content = text.slice(lastPos, pos);
                  token.level = level;
                  nodes.push(token);
                }
                token = new state.Token("link_open", "a", 1);
                token.attrs = [["href", fullUrl]];
                token.level = level++;
                token.markup = "linkify";
                token.info = "auto";
                nodes.push(token);
                token = new state.Token("text", "", 0);
                token.content = urlText;
                token.level = level;
                nodes.push(token);
                token = new state.Token("link_close", "a", -1);
                token.level = --level;
                token.markup = "linkify";
                token.info = "auto";
                nodes.push(token);
                lastPos = links[ln].lastIndex;
              }
              if (lastPos < text.length) {
                token = new state.Token("text", "", 0);
                token.content = text.slice(lastPos);
                token.level = level;
                nodes.push(token);
              }
              blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
            }
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/replacements.js
  var require_replacements = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/replacements.js"(exports, module) {
      "use strict";
      var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
      var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;
      var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
      var SCOPED_ABBR = {
        c: "\xA9",
        r: "\xAE",
        p: "\xA7",
        tm: "\u2122"
      };
      function replaceFn(match, name) {
        return SCOPED_ABBR[name.toLowerCase()];
      }
      function replace_scoped(inlineTokens) {
        var i, token, inside_autolink = 0;
        for (i = inlineTokens.length - 1; i >= 0; i--) {
          token = inlineTokens[i];
          if (token.type === "text" && !inside_autolink) {
            token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
          }
          if (token.type === "link_open" && token.info === "auto") {
            inside_autolink--;
          }
          if (token.type === "link_close" && token.info === "auto") {
            inside_autolink++;
          }
        }
      }
      function replace_rare(inlineTokens) {
        var i, token, inside_autolink = 0;
        for (i = inlineTokens.length - 1; i >= 0; i--) {
          token = inlineTokens[i];
          if (token.type === "text" && !inside_autolink) {
            if (RARE_RE.test(token.content)) {
              token.content = token.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1\u2014").replace(/(^|\s)--(?=\s|$)/mg, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1\u2013");
            }
          }
          if (token.type === "link_open" && token.info === "auto") {
            inside_autolink--;
          }
          if (token.type === "link_close" && token.info === "auto") {
            inside_autolink++;
          }
        }
      }
      module.exports = function replace(state) {
        var blkIdx;
        if (!state.md.options.typographer) {
          return;
        }
        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
          if (state.tokens[blkIdx].type !== "inline") {
            continue;
          }
          if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
            replace_scoped(state.tokens[blkIdx].children);
          }
          if (RARE_RE.test(state.tokens[blkIdx].content)) {
            replace_rare(state.tokens[blkIdx].children);
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/smartquotes.js
  var require_smartquotes = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/smartquotes.js"(exports, module) {
      "use strict";
      var isWhiteSpace = require_utils().isWhiteSpace;
      var isPunctChar = require_utils().isPunctChar;
      var isMdAsciiPunct = require_utils().isMdAsciiPunct;
      var QUOTE_TEST_RE = /['"]/;
      var QUOTE_RE = /['"]/g;
      var APOSTROPHE = "\u2019";
      function replaceAt(str, index, ch) {
        return str.substr(0, index) + ch + str.substr(index + 1);
      }
      function process_inlines(tokens, state) {
        var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar, isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace, canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;
        stack = [];
        for (i = 0; i < tokens.length; i++) {
          token = tokens[i];
          thisLevel = tokens[i].level;
          for (j = stack.length - 1; j >= 0; j--) {
            if (stack[j].level <= thisLevel) {
              break;
            }
          }
          stack.length = j + 1;
          if (token.type !== "text") {
            continue;
          }
          text = token.content;
          pos = 0;
          max = text.length;
          OUTER:
            while (pos < max) {
              QUOTE_RE.lastIndex = pos;
              t = QUOTE_RE.exec(text);
              if (!t) {
                break;
              }
              canOpen = canClose = true;
              pos = t.index + 1;
              isSingle = t[0] === "'";
              lastChar = 32;
              if (t.index - 1 >= 0) {
                lastChar = text.charCodeAt(t.index - 1);
              } else {
                for (j = i - 1; j >= 0; j--) {
                  if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak")
                    break;
                  if (!tokens[j].content)
                    continue;
                  lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                  break;
                }
              }
              nextChar = 32;
              if (pos < max) {
                nextChar = text.charCodeAt(pos);
              } else {
                for (j = i + 1; j < tokens.length; j++) {
                  if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak")
                    break;
                  if (!tokens[j].content)
                    continue;
                  nextChar = tokens[j].content.charCodeAt(0);
                  break;
                }
              }
              isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
              isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
              isLastWhiteSpace = isWhiteSpace(lastChar);
              isNextWhiteSpace = isWhiteSpace(nextChar);
              if (isNextWhiteSpace) {
                canOpen = false;
              } else if (isNextPunctChar) {
                if (!(isLastWhiteSpace || isLastPunctChar)) {
                  canOpen = false;
                }
              }
              if (isLastWhiteSpace) {
                canClose = false;
              } else if (isLastPunctChar) {
                if (!(isNextWhiteSpace || isNextPunctChar)) {
                  canClose = false;
                }
              }
              if (nextChar === 34 && t[0] === '"') {
                if (lastChar >= 48 && lastChar <= 57) {
                  canClose = canOpen = false;
                }
              }
              if (canOpen && canClose) {
                canOpen = isLastPunctChar;
                canClose = isNextPunctChar;
              }
              if (!canOpen && !canClose) {
                if (isSingle) {
                  token.content = replaceAt(token.content, t.index, APOSTROPHE);
                }
                continue;
              }
              if (canClose) {
                for (j = stack.length - 1; j >= 0; j--) {
                  item = stack[j];
                  if (stack[j].level < thisLevel) {
                    break;
                  }
                  if (item.single === isSingle && stack[j].level === thisLevel) {
                    item = stack[j];
                    if (isSingle) {
                      openQuote = state.md.options.quotes[2];
                      closeQuote = state.md.options.quotes[3];
                    } else {
                      openQuote = state.md.options.quotes[0];
                      closeQuote = state.md.options.quotes[1];
                    }
                    token.content = replaceAt(token.content, t.index, closeQuote);
                    tokens[item.token].content = replaceAt(
                      tokens[item.token].content,
                      item.pos,
                      openQuote
                    );
                    pos += closeQuote.length - 1;
                    if (item.token === i) {
                      pos += openQuote.length - 1;
                    }
                    text = token.content;
                    max = text.length;
                    stack.length = j;
                    continue OUTER;
                  }
                }
              }
              if (canOpen) {
                stack.push({
                  token: i,
                  pos: t.index,
                  single: isSingle,
                  level: thisLevel
                });
              } else if (canClose && isSingle) {
                token.content = replaceAt(token.content, t.index, APOSTROPHE);
              }
            }
        }
      }
      module.exports = function smartquotes(state) {
        var blkIdx;
        if (!state.md.options.typographer) {
          return;
        }
        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
          if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
            continue;
          }
          process_inlines(state.tokens[blkIdx].children, state);
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/token.js
  var require_token = __commonJS({
    "../../node_modules/markdown-it/lib/token.js"(exports, module) {
      "use strict";
      function Token(type, tag, nesting) {
        this.type = type;
        this.tag = tag;
        this.attrs = null;
        this.map = null;
        this.nesting = nesting;
        this.level = 0;
        this.children = null;
        this.content = "";
        this.markup = "";
        this.info = "";
        this.meta = null;
        this.block = false;
        this.hidden = false;
      }
      Token.prototype.attrIndex = function attrIndex(name) {
        var attrs, i, len;
        if (!this.attrs) {
          return -1;
        }
        attrs = this.attrs;
        for (i = 0, len = attrs.length; i < len; i++) {
          if (attrs[i][0] === name) {
            return i;
          }
        }
        return -1;
      };
      Token.prototype.attrPush = function attrPush(attrData) {
        if (this.attrs) {
          this.attrs.push(attrData);
        } else {
          this.attrs = [attrData];
        }
      };
      Token.prototype.attrSet = function attrSet(name, value) {
        var idx = this.attrIndex(name), attrData = [name, value];
        if (idx < 0) {
          this.attrPush(attrData);
        } else {
          this.attrs[idx] = attrData;
        }
      };
      Token.prototype.attrGet = function attrGet(name) {
        var idx = this.attrIndex(name), value = null;
        if (idx >= 0) {
          value = this.attrs[idx][1];
        }
        return value;
      };
      Token.prototype.attrJoin = function attrJoin(name, value) {
        var idx = this.attrIndex(name);
        if (idx < 0) {
          this.attrPush([name, value]);
        } else {
          this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
        }
      };
      module.exports = Token;
    }
  });

  // ../../node_modules/markdown-it/lib/rules_core/state_core.js
  var require_state_core = __commonJS({
    "../../node_modules/markdown-it/lib/rules_core/state_core.js"(exports, module) {
      "use strict";
      var Token = require_token();
      function StateCore(src, md, env) {
        this.src = src;
        this.env = env;
        this.tokens = [];
        this.inlineMode = false;
        this.md = md;
      }
      StateCore.prototype.Token = Token;
      module.exports = StateCore;
    }
  });

  // ../../node_modules/markdown-it/lib/parser_core.js
  var require_parser_core = __commonJS({
    "../../node_modules/markdown-it/lib/parser_core.js"(exports, module) {
      "use strict";
      var Ruler = require_ruler();
      var _rules = [
        ["normalize", require_normalize()],
        ["block", require_block()],
        ["inline", require_inline()],
        ["linkify", require_linkify()],
        ["replacements", require_replacements()],
        ["smartquotes", require_smartquotes()]
      ];
      function Core() {
        this.ruler = new Ruler();
        for (var i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1]);
        }
      }
      Core.prototype.process = function(state) {
        var i, l, rules;
        rules = this.ruler.getRules("");
        for (i = 0, l = rules.length; i < l; i++) {
          rules[i](state);
        }
      };
      Core.prototype.State = require_state_core();
      module.exports = Core;
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/table.js
  var require_table = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/table.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      function getLine(state, line) {
        var pos = state.bMarks[line] + state.tShift[line], max = state.eMarks[line];
        return state.src.substr(pos, max - pos);
      }
      function escapedSplit(str) {
        var result = [], pos = 0, max = str.length, ch, isEscaped = false, lastPos = 0, current = "";
        ch = str.charCodeAt(pos);
        while (pos < max) {
          if (ch === 124) {
            if (!isEscaped) {
              result.push(current + str.substring(lastPos, pos));
              current = "";
              lastPos = pos + 1;
            } else {
              current += str.substring(lastPos, pos - 1);
              lastPos = pos;
            }
          }
          isEscaped = ch === 92;
          pos++;
          ch = str.charCodeAt(pos);
        }
        result.push(current + str.substring(lastPos));
        return result;
      }
      module.exports = function table(state, startLine, endLine, silent) {
        var ch, lineText, pos, i, l, nextLine, columns, columnCount, token, aligns, t, tableLines, tbodyLines, oldParentType, terminate, terminatorRules, firstCh, secondCh;
        if (startLine + 2 > endLine) {
          return false;
        }
        nextLine = startLine + 1;
        if (state.sCount[nextLine] < state.blkIndent) {
          return false;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          return false;
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        if (pos >= state.eMarks[nextLine]) {
          return false;
        }
        firstCh = state.src.charCodeAt(pos++);
        if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
          return false;
        }
        if (pos >= state.eMarks[nextLine]) {
          return false;
        }
        secondCh = state.src.charCodeAt(pos++);
        if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
          return false;
        }
        if (firstCh === 45 && isSpace(secondCh)) {
          return false;
        }
        while (pos < state.eMarks[nextLine]) {
          ch = state.src.charCodeAt(pos);
          if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
            return false;
          }
          pos++;
        }
        lineText = getLine(state, startLine + 1);
        columns = lineText.split("|");
        aligns = [];
        for (i = 0; i < columns.length; i++) {
          t = columns[i].trim();
          if (!t) {
            if (i === 0 || i === columns.length - 1) {
              continue;
            } else {
              return false;
            }
          }
          if (!/^:?-+:?$/.test(t)) {
            return false;
          }
          if (t.charCodeAt(t.length - 1) === 58) {
            aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
          } else if (t.charCodeAt(0) === 58) {
            aligns.push("left");
          } else {
            aligns.push("");
          }
        }
        lineText = getLine(state, startLine).trim();
        if (lineText.indexOf("|") === -1) {
          return false;
        }
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        columns = escapedSplit(lineText);
        if (columns.length && columns[0] === "")
          columns.shift();
        if (columns.length && columns[columns.length - 1] === "")
          columns.pop();
        columnCount = columns.length;
        if (columnCount === 0 || columnCount !== aligns.length) {
          return false;
        }
        if (silent) {
          return true;
        }
        oldParentType = state.parentType;
        state.parentType = "table";
        terminatorRules = state.md.block.ruler.getRules("blockquote");
        token = state.push("table_open", "table", 1);
        token.map = tableLines = [startLine, 0];
        token = state.push("thead_open", "thead", 1);
        token.map = [startLine, startLine + 1];
        token = state.push("tr_open", "tr", 1);
        token.map = [startLine, startLine + 1];
        for (i = 0; i < columns.length; i++) {
          token = state.push("th_open", "th", 1);
          if (aligns[i]) {
            token.attrs = [["style", "text-align:" + aligns[i]]];
          }
          token = state.push("inline", "", 0);
          token.content = columns[i].trim();
          token.children = [];
          token = state.push("th_close", "th", -1);
        }
        token = state.push("tr_close", "tr", -1);
        token = state.push("thead_close", "thead", -1);
        for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
          lineText = getLine(state, nextLine).trim();
          if (!lineText) {
            break;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            break;
          }
          columns = escapedSplit(lineText);
          if (columns.length && columns[0] === "")
            columns.shift();
          if (columns.length && columns[columns.length - 1] === "")
            columns.pop();
          if (nextLine === startLine + 2) {
            token = state.push("tbody_open", "tbody", 1);
            token.map = tbodyLines = [startLine + 2, 0];
          }
          token = state.push("tr_open", "tr", 1);
          token.map = [nextLine, nextLine + 1];
          for (i = 0; i < columnCount; i++) {
            token = state.push("td_open", "td", 1);
            if (aligns[i]) {
              token.attrs = [["style", "text-align:" + aligns[i]]];
            }
            token = state.push("inline", "", 0);
            token.content = columns[i] ? columns[i].trim() : "";
            token.children = [];
            token = state.push("td_close", "td", -1);
          }
          token = state.push("tr_close", "tr", -1);
        }
        if (tbodyLines) {
          token = state.push("tbody_close", "tbody", -1);
          tbodyLines[1] = nextLine;
        }
        token = state.push("table_close", "table", -1);
        tableLines[1] = nextLine;
        state.parentType = oldParentType;
        state.line = nextLine;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/code.js
  var require_code = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/code.js"(exports, module) {
      "use strict";
      module.exports = function code(state, startLine, endLine) {
        var nextLine, last, token;
        if (state.sCount[startLine] - state.blkIndent < 4) {
          return false;
        }
        last = nextLine = startLine + 1;
        while (nextLine < endLine) {
          if (state.isEmpty(nextLine)) {
            nextLine++;
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
          }
          break;
        }
        state.line = last;
        token = state.push("code_block", "code", 0);
        token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
        token.map = [startLine, state.line];
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/fence.js
  var require_fence = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/fence.js"(exports, module) {
      "use strict";
      module.exports = function fence(state, startLine, endLine, silent) {
        var marker, len, params, nextLine, mem, token, markup, haveEndMarker = false, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (pos + 3 > max) {
          return false;
        }
        marker = state.src.charCodeAt(pos);
        if (marker !== 126 && marker !== 96) {
          return false;
        }
        mem = pos;
        pos = state.skipChars(pos, marker);
        len = pos - mem;
        if (len < 3) {
          return false;
        }
        markup = state.src.slice(mem, pos);
        params = state.src.slice(pos, max);
        if (marker === 96) {
          if (params.indexOf(String.fromCharCode(marker)) >= 0) {
            return false;
          }
        }
        if (silent) {
          return true;
        }
        nextLine = startLine;
        for (; ; ) {
          nextLine++;
          if (nextLine >= endLine) {
            break;
          }
          pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          if (state.src.charCodeAt(pos) !== marker) {
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            continue;
          }
          pos = state.skipChars(pos, marker);
          if (pos - mem < len) {
            continue;
          }
          pos = state.skipSpaces(pos);
          if (pos < max) {
            continue;
          }
          haveEndMarker = true;
          break;
        }
        len = state.sCount[startLine];
        state.line = nextLine + (haveEndMarker ? 1 : 0);
        token = state.push("fence", "code", 0);
        token.info = params;
        token.content = state.getLines(startLine + 1, nextLine, len, true);
        token.markup = markup;
        token.map = [startLine, state.line];
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/blockquote.js
  var require_blockquote = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/blockquote.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      module.exports = function blockquote(state, startLine, endLine, silent) {
        var adjustTab, ch, i, initial, l, lastLineEmpty, lines, nextLine, offset, oldBMarks, oldBSCount, oldIndent, oldParentType, oldSCount, oldTShift, spaceAfterMarker, terminate, terminatorRules, token, isOutdented, oldLineMax = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (state.src.charCodeAt(pos++) !== 62) {
          return false;
        }
        if (silent) {
          return true;
        }
        initial = offset = state.sCount[startLine] + 1;
        if (state.src.charCodeAt(pos) === 32) {
          pos++;
          initial++;
          offset++;
          adjustTab = false;
          spaceAfterMarker = true;
        } else if (state.src.charCodeAt(pos) === 9) {
          spaceAfterMarker = true;
          if ((state.bsCount[startLine] + offset) % 4 === 3) {
            pos++;
            initial++;
            offset++;
            adjustTab = false;
          } else {
            adjustTab = true;
          }
        } else {
          spaceAfterMarker = false;
        }
        oldBMarks = [state.bMarks[startLine]];
        state.bMarks[startLine] = pos;
        while (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (isSpace(ch)) {
            if (ch === 9) {
              offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
            } else {
              offset++;
            }
          } else {
            break;
          }
          pos++;
        }
        oldBSCount = [state.bsCount[startLine]];
        state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);
        lastLineEmpty = pos >= max;
        oldSCount = [state.sCount[startLine]];
        state.sCount[startLine] = offset - initial;
        oldTShift = [state.tShift[startLine]];
        state.tShift[startLine] = pos - state.bMarks[startLine];
        terminatorRules = state.md.block.ruler.getRules("blockquote");
        oldParentType = state.parentType;
        state.parentType = "blockquote";
        for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
          isOutdented = state.sCount[nextLine] < state.blkIndent;
          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (pos >= max) {
            break;
          }
          if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
            initial = offset = state.sCount[nextLine] + 1;
            if (state.src.charCodeAt(pos) === 32) {
              pos++;
              initial++;
              offset++;
              adjustTab = false;
              spaceAfterMarker = true;
            } else if (state.src.charCodeAt(pos) === 9) {
              spaceAfterMarker = true;
              if ((state.bsCount[nextLine] + offset) % 4 === 3) {
                pos++;
                initial++;
                offset++;
                adjustTab = false;
              } else {
                adjustTab = true;
              }
            } else {
              spaceAfterMarker = false;
            }
            oldBMarks.push(state.bMarks[nextLine]);
            state.bMarks[nextLine] = pos;
            while (pos < max) {
              ch = state.src.charCodeAt(pos);
              if (isSpace(ch)) {
                if (ch === 9) {
                  offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
                } else {
                  offset++;
                }
              } else {
                break;
              }
              pos++;
            }
            lastLineEmpty = pos >= max;
            oldBSCount.push(state.bsCount[nextLine]);
            state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
            oldSCount.push(state.sCount[nextLine]);
            state.sCount[nextLine] = offset - initial;
            oldTShift.push(state.tShift[nextLine]);
            state.tShift[nextLine] = pos - state.bMarks[nextLine];
            continue;
          }
          if (lastLineEmpty) {
            break;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            state.lineMax = nextLine;
            if (state.blkIndent !== 0) {
              oldBMarks.push(state.bMarks[nextLine]);
              oldBSCount.push(state.bsCount[nextLine]);
              oldTShift.push(state.tShift[nextLine]);
              oldSCount.push(state.sCount[nextLine]);
              state.sCount[nextLine] -= state.blkIndent;
            }
            break;
          }
          oldBMarks.push(state.bMarks[nextLine]);
          oldBSCount.push(state.bsCount[nextLine]);
          oldTShift.push(state.tShift[nextLine]);
          oldSCount.push(state.sCount[nextLine]);
          state.sCount[nextLine] = -1;
        }
        oldIndent = state.blkIndent;
        state.blkIndent = 0;
        token = state.push("blockquote_open", "blockquote", 1);
        token.markup = ">";
        token.map = lines = [startLine, 0];
        state.md.block.tokenize(state, startLine, nextLine);
        token = state.push("blockquote_close", "blockquote", -1);
        token.markup = ">";
        state.lineMax = oldLineMax;
        state.parentType = oldParentType;
        lines[1] = state.line;
        for (i = 0; i < oldTShift.length; i++) {
          state.bMarks[i + startLine] = oldBMarks[i];
          state.tShift[i + startLine] = oldTShift[i];
          state.sCount[i + startLine] = oldSCount[i];
          state.bsCount[i + startLine] = oldBSCount[i];
        }
        state.blkIndent = oldIndent;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/hr.js
  var require_hr = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/hr.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      module.exports = function hr(state, startLine, endLine, silent) {
        var marker, cnt, ch, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        marker = state.src.charCodeAt(pos++);
        if (marker !== 42 && marker !== 45 && marker !== 95) {
          return false;
        }
        cnt = 1;
        while (pos < max) {
          ch = state.src.charCodeAt(pos++);
          if (ch !== marker && !isSpace(ch)) {
            return false;
          }
          if (ch === marker) {
            cnt++;
          }
        }
        if (cnt < 3) {
          return false;
        }
        if (silent) {
          return true;
        }
        state.line = startLine + 1;
        token = state.push("hr", "hr", 0);
        token.map = [startLine, state.line];
        token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/list.js
  var require_list = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/list.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      function skipBulletListMarker(state, startLine) {
        var marker, pos, max, ch;
        pos = state.bMarks[startLine] + state.tShift[startLine];
        max = state.eMarks[startLine];
        marker = state.src.charCodeAt(pos++);
        if (marker !== 42 && marker !== 45 && marker !== 43) {
          return -1;
        }
        if (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            return -1;
          }
        }
        return pos;
      }
      function skipOrderedListMarker(state, startLine) {
        var ch, start = state.bMarks[startLine] + state.tShift[startLine], pos = start, max = state.eMarks[startLine];
        if (pos + 1 >= max) {
          return -1;
        }
        ch = state.src.charCodeAt(pos++);
        if (ch < 48 || ch > 57) {
          return -1;
        }
        for (; ; ) {
          if (pos >= max) {
            return -1;
          }
          ch = state.src.charCodeAt(pos++);
          if (ch >= 48 && ch <= 57) {
            if (pos - start >= 10) {
              return -1;
            }
            continue;
          }
          if (ch === 41 || ch === 46) {
            break;
          }
          return -1;
        }
        if (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            return -1;
          }
        }
        return pos;
      }
      function markTightParagraphs(state, idx) {
        var i, l, level = state.level + 2;
        for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
          if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
            state.tokens[i + 2].hidden = true;
            state.tokens[i].hidden = true;
            i += 2;
          }
        }
      }
      module.exports = function list(state, startLine, endLine, silent) {
        var ch, contentStart, i, indent, indentAfterMarker, initial, isOrdered, itemLines, l, listLines, listTokIdx, markerCharCode, markerValue, max, nextLine, offset, oldListIndent, oldParentType, oldSCount, oldTShift, oldTight, pos, posAfterMarker, prevEmptyEnd, start, terminate, terminatorRules, token, isTerminatingParagraph = false, tight = true;
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (state.listIndent >= 0 && state.sCount[startLine] - state.listIndent >= 4 && state.sCount[startLine] < state.blkIndent) {
          return false;
        }
        if (silent && state.parentType === "paragraph") {
          if (state.sCount[startLine] >= state.blkIndent) {
            isTerminatingParagraph = true;
          }
        }
        if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
          isOrdered = true;
          start = state.bMarks[startLine] + state.tShift[startLine];
          markerValue = Number(state.src.slice(start, posAfterMarker - 1));
          if (isTerminatingParagraph && markerValue !== 1)
            return false;
        } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
          isOrdered = false;
        } else {
          return false;
        }
        if (isTerminatingParagraph) {
          if (state.skipSpaces(posAfterMarker) >= state.eMarks[startLine])
            return false;
        }
        markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
        if (silent) {
          return true;
        }
        listTokIdx = state.tokens.length;
        if (isOrdered) {
          token = state.push("ordered_list_open", "ol", 1);
          if (markerValue !== 1) {
            token.attrs = [["start", markerValue]];
          }
        } else {
          token = state.push("bullet_list_open", "ul", 1);
        }
        token.map = listLines = [startLine, 0];
        token.markup = String.fromCharCode(markerCharCode);
        nextLine = startLine;
        prevEmptyEnd = false;
        terminatorRules = state.md.block.ruler.getRules("list");
        oldParentType = state.parentType;
        state.parentType = "list";
        while (nextLine < endLine) {
          pos = posAfterMarker;
          max = state.eMarks[nextLine];
          initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);
          while (pos < max) {
            ch = state.src.charCodeAt(pos);
            if (ch === 9) {
              offset += 4 - (offset + state.bsCount[nextLine]) % 4;
            } else if (ch === 32) {
              offset++;
            } else {
              break;
            }
            pos++;
          }
          contentStart = pos;
          if (contentStart >= max) {
            indentAfterMarker = 1;
          } else {
            indentAfterMarker = offset - initial;
          }
          if (indentAfterMarker > 4) {
            indentAfterMarker = 1;
          }
          indent = initial + indentAfterMarker;
          token = state.push("list_item_open", "li", 1);
          token.markup = String.fromCharCode(markerCharCode);
          token.map = itemLines = [startLine, 0];
          if (isOrdered) {
            token.info = state.src.slice(start, posAfterMarker - 1);
          }
          oldTight = state.tight;
          oldTShift = state.tShift[startLine];
          oldSCount = state.sCount[startLine];
          oldListIndent = state.listIndent;
          state.listIndent = state.blkIndent;
          state.blkIndent = indent;
          state.tight = true;
          state.tShift[startLine] = contentStart - state.bMarks[startLine];
          state.sCount[startLine] = offset;
          if (contentStart >= max && state.isEmpty(startLine + 1)) {
            state.line = Math.min(state.line + 2, endLine);
          } else {
            state.md.block.tokenize(state, startLine, endLine, true);
          }
          if (!state.tight || prevEmptyEnd) {
            tight = false;
          }
          prevEmptyEnd = state.line - startLine > 1 && state.isEmpty(state.line - 1);
          state.blkIndent = state.listIndent;
          state.listIndent = oldListIndent;
          state.tShift[startLine] = oldTShift;
          state.sCount[startLine] = oldSCount;
          state.tight = oldTight;
          token = state.push("list_item_close", "li", -1);
          token.markup = String.fromCharCode(markerCharCode);
          nextLine = startLine = state.line;
          itemLines[1] = nextLine;
          contentStart = state.bMarks[startLine];
          if (nextLine >= endLine) {
            break;
          }
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          if (state.sCount[startLine] - state.blkIndent >= 4) {
            break;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
          if (isOrdered) {
            posAfterMarker = skipOrderedListMarker(state, nextLine);
            if (posAfterMarker < 0) {
              break;
            }
            start = state.bMarks[nextLine] + state.tShift[nextLine];
          } else {
            posAfterMarker = skipBulletListMarker(state, nextLine);
            if (posAfterMarker < 0) {
              break;
            }
          }
          if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
            break;
          }
        }
        if (isOrdered) {
          token = state.push("ordered_list_close", "ol", -1);
        } else {
          token = state.push("bullet_list_close", "ul", -1);
        }
        token.markup = String.fromCharCode(markerCharCode);
        listLines[1] = nextLine;
        state.line = nextLine;
        state.parentType = oldParentType;
        if (tight) {
          markTightParagraphs(state, listTokIdx);
        }
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/reference.js
  var require_reference = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/reference.js"(exports, module) {
      "use strict";
      var normalizeReference = require_utils().normalizeReference;
      var isSpace = require_utils().isSpace;
      module.exports = function reference(state, startLine, _endLine, silent) {
        var ch, destEndPos, destEndLineNo, endLine, href, i, l, label, labelEnd, oldParentType, res, start, str, terminate, terminatorRules, title, lines = 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine], nextLine = startLine + 1;
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (state.src.charCodeAt(pos) !== 91) {
          return false;
        }
        while (++pos < max) {
          if (state.src.charCodeAt(pos) === 93 && state.src.charCodeAt(pos - 1) !== 92) {
            if (pos + 1 === max) {
              return false;
            }
            if (state.src.charCodeAt(pos + 1) !== 58) {
              return false;
            }
            break;
          }
        }
        endLine = state.lineMax;
        terminatorRules = state.md.block.ruler.getRules("reference");
        oldParentType = state.parentType;
        state.parentType = "reference";
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }
          if (state.sCount[nextLine] < 0) {
            continue;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }
        str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        max = str.length;
        for (pos = 1; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 91) {
            return false;
          } else if (ch === 93) {
            labelEnd = pos;
            break;
          } else if (ch === 10) {
            lines++;
          } else if (ch === 92) {
            pos++;
            if (pos < max && str.charCodeAt(pos) === 10) {
              lines++;
            }
          }
        }
        if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) {
          return false;
        }
        for (pos = labelEnd + 2; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 10) {
            lines++;
          } else if (isSpace(ch)) {
          } else {
            break;
          }
        }
        res = state.md.helpers.parseLinkDestination(str, pos, max);
        if (!res.ok) {
          return false;
        }
        href = state.md.normalizeLink(res.str);
        if (!state.md.validateLink(href)) {
          return false;
        }
        pos = res.pos;
        lines += res.lines;
        destEndPos = pos;
        destEndLineNo = lines;
        start = pos;
        for (; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 10) {
            lines++;
          } else if (isSpace(ch)) {
          } else {
            break;
          }
        }
        res = state.md.helpers.parseLinkTitle(str, pos, max);
        if (pos < max && start !== pos && res.ok) {
          title = res.str;
          pos = res.pos;
          lines += res.lines;
        } else {
          title = "";
          pos = destEndPos;
          lines = destEndLineNo;
        }
        while (pos < max) {
          ch = str.charCodeAt(pos);
          if (!isSpace(ch)) {
            break;
          }
          pos++;
        }
        if (pos < max && str.charCodeAt(pos) !== 10) {
          if (title) {
            title = "";
            pos = destEndPos;
            lines = destEndLineNo;
            while (pos < max) {
              ch = str.charCodeAt(pos);
              if (!isSpace(ch)) {
                break;
              }
              pos++;
            }
          }
        }
        if (pos < max && str.charCodeAt(pos) !== 10) {
          return false;
        }
        label = normalizeReference(str.slice(1, labelEnd));
        if (!label) {
          return false;
        }
        if (silent) {
          return true;
        }
        if (typeof state.env.references === "undefined") {
          state.env.references = {};
        }
        if (typeof state.env.references[label] === "undefined") {
          state.env.references[label] = { title, href };
        }
        state.parentType = oldParentType;
        state.line = startLine + lines + 1;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/common/html_blocks.js
  var require_html_blocks = __commonJS({
    "../../node_modules/markdown-it/lib/common/html_blocks.js"(exports, module) {
      "use strict";
      module.exports = [
        "address",
        "article",
        "aside",
        "base",
        "basefont",
        "blockquote",
        "body",
        "caption",
        "center",
        "col",
        "colgroup",
        "dd",
        "details",
        "dialog",
        "dir",
        "div",
        "dl",
        "dt",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "frame",
        "frameset",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hr",
        "html",
        "iframe",
        "legend",
        "li",
        "link",
        "main",
        "menu",
        "menuitem",
        "nav",
        "noframes",
        "ol",
        "optgroup",
        "option",
        "p",
        "param",
        "section",
        "source",
        "summary",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "title",
        "tr",
        "track",
        "ul"
      ];
    }
  });

  // ../../node_modules/markdown-it/lib/common/html_re.js
  var require_html_re = __commonJS({
    "../../node_modules/markdown-it/lib/common/html_re.js"(exports, module) {
      "use strict";
      var attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
      var unquoted = "[^\"'=<>`\\x00-\\x20]+";
      var single_quoted = "'[^']*'";
      var double_quoted = '"[^"]*"';
      var attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
      var attribute = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
      var open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
      var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
      var comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
      var processing = "<[?][\\s\\S]*?[?]>";
      var declaration = "<![A-Z]+\\s+[^>]*>";
      var cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
      var HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
      var HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
      module.exports.HTML_TAG_RE = HTML_TAG_RE;
      module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/html_block.js
  var require_html_block = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/html_block.js"(exports, module) {
      "use strict";
      var block_names = require_html_blocks();
      var HTML_OPEN_CLOSE_TAG_RE = require_html_re().HTML_OPEN_CLOSE_TAG_RE;
      var HTML_SEQUENCES = [
        [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
        [/^<!--/, /-->/, true],
        [/^<\?/, /\?>/, true],
        [/^<![A-Z]/, />/, true],
        [/^<!\[CDATA\[/, /\]\]>/, true],
        [new RegExp("^</?(" + block_names.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
        [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
      ];
      module.exports = function html_block(state, startLine, endLine, silent) {
        var i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (!state.md.options.html) {
          return false;
        }
        if (state.src.charCodeAt(pos) !== 60) {
          return false;
        }
        lineText = state.src.slice(pos, max);
        for (i = 0; i < HTML_SEQUENCES.length; i++) {
          if (HTML_SEQUENCES[i][0].test(lineText)) {
            break;
          }
        }
        if (i === HTML_SEQUENCES.length) {
          return false;
        }
        if (silent) {
          return HTML_SEQUENCES[i][2];
        }
        nextLine = startLine + 1;
        if (!HTML_SEQUENCES[i][1].test(lineText)) {
          for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
              break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (HTML_SEQUENCES[i][1].test(lineText)) {
              if (lineText.length !== 0) {
                nextLine++;
              }
              break;
            }
          }
        }
        state.line = nextLine;
        token = state.push("html_block", "", 0);
        token.map = [startLine, nextLine];
        token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/heading.js
  var require_heading = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/heading.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      module.exports = function heading(state, startLine, endLine, silent) {
        var ch, level, tmp, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        ch = state.src.charCodeAt(pos);
        if (ch !== 35 || pos >= max) {
          return false;
        }
        level = 1;
        ch = state.src.charCodeAt(++pos);
        while (ch === 35 && pos < max && level <= 6) {
          level++;
          ch = state.src.charCodeAt(++pos);
        }
        if (level > 6 || pos < max && !isSpace(ch)) {
          return false;
        }
        if (silent) {
          return true;
        }
        max = state.skipSpacesBack(max, pos);
        tmp = state.skipCharsBack(max, 35, pos);
        if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
          max = tmp;
        }
        state.line = startLine + 1;
        token = state.push("heading_open", "h" + String(level), 1);
        token.markup = "########".slice(0, level);
        token.map = [startLine, state.line];
        token = state.push("inline", "", 0);
        token.content = state.src.slice(pos, max).trim();
        token.map = [startLine, state.line];
        token.children = [];
        token = state.push("heading_close", "h" + String(level), -1);
        token.markup = "########".slice(0, level);
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/lheading.js
  var require_lheading = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/lheading.js"(exports, module) {
      "use strict";
      module.exports = function lheading(state, startLine, endLine) {
        var content, terminate, i, l, token, pos, max, level, marker, nextLine = startLine + 1, oldParentType, terminatorRules = state.md.block.ruler.getRules("paragraph");
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        oldParentType = state.parentType;
        state.parentType = "paragraph";
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }
          if (state.sCount[nextLine] >= state.blkIndent) {
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            if (pos < max) {
              marker = state.src.charCodeAt(pos);
              if (marker === 45 || marker === 61) {
                pos = state.skipChars(pos, marker);
                pos = state.skipSpaces(pos);
                if (pos >= max) {
                  level = marker === 61 ? 1 : 2;
                  break;
                }
              }
            }
          }
          if (state.sCount[nextLine] < 0) {
            continue;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }
        if (!level) {
          return false;
        }
        content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        state.line = nextLine + 1;
        token = state.push("heading_open", "h" + String(level), 1);
        token.markup = String.fromCharCode(marker);
        token.map = [startLine, state.line];
        token = state.push("inline", "", 0);
        token.content = content;
        token.map = [startLine, state.line - 1];
        token.children = [];
        token = state.push("heading_close", "h" + String(level), -1);
        token.markup = String.fromCharCode(marker);
        state.parentType = oldParentType;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/paragraph.js
  var require_paragraph = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/paragraph.js"(exports, module) {
      "use strict";
      module.exports = function paragraph(state, startLine) {
        var content, terminate, i, l, token, oldParentType, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules("paragraph"), endLine = state.lineMax;
        oldParentType = state.parentType;
        state.parentType = "paragraph";
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }
          if (state.sCount[nextLine] < 0) {
            continue;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }
        content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        state.line = nextLine;
        token = state.push("paragraph_open", "p", 1);
        token.map = [startLine, state.line];
        token = state.push("inline", "", 0);
        token.content = content;
        token.map = [startLine, state.line];
        token.children = [];
        token = state.push("paragraph_close", "p", -1);
        state.parentType = oldParentType;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_block/state_block.js
  var require_state_block = __commonJS({
    "../../node_modules/markdown-it/lib/rules_block/state_block.js"(exports, module) {
      "use strict";
      var Token = require_token();
      var isSpace = require_utils().isSpace;
      function StateBlock(src, md, env, tokens) {
        var ch, s, start, pos, len, indent, offset, indent_found;
        this.src = src;
        this.md = md;
        this.env = env;
        this.tokens = tokens;
        this.bMarks = [];
        this.eMarks = [];
        this.tShift = [];
        this.sCount = [];
        this.bsCount = [];
        this.blkIndent = 0;
        this.line = 0;
        this.lineMax = 0;
        this.tight = false;
        this.ddIndent = -1;
        this.listIndent = -1;
        this.parentType = "root";
        this.level = 0;
        this.result = "";
        s = this.src;
        indent_found = false;
        for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
          ch = s.charCodeAt(pos);
          if (!indent_found) {
            if (isSpace(ch)) {
              indent++;
              if (ch === 9) {
                offset += 4 - offset % 4;
              } else {
                offset++;
              }
              continue;
            } else {
              indent_found = true;
            }
          }
          if (ch === 10 || pos === len - 1) {
            if (ch !== 10) {
              pos++;
            }
            this.bMarks.push(start);
            this.eMarks.push(pos);
            this.tShift.push(indent);
            this.sCount.push(offset);
            this.bsCount.push(0);
            indent_found = false;
            indent = 0;
            offset = 0;
            start = pos + 1;
          }
        }
        this.bMarks.push(s.length);
        this.eMarks.push(s.length);
        this.tShift.push(0);
        this.sCount.push(0);
        this.bsCount.push(0);
        this.lineMax = this.bMarks.length - 1;
      }
      StateBlock.prototype.push = function(type, tag, nesting) {
        var token = new Token(type, tag, nesting);
        token.block = true;
        if (nesting < 0)
          this.level--;
        token.level = this.level;
        if (nesting > 0)
          this.level++;
        this.tokens.push(token);
        return token;
      };
      StateBlock.prototype.isEmpty = function isEmpty(line) {
        return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
      };
      StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
        for (var max = this.lineMax; from < max; from++) {
          if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
            break;
          }
        }
        return from;
      };
      StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
        var ch;
        for (var max = this.src.length; pos < max; pos++) {
          ch = this.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            break;
          }
        }
        return pos;
      };
      StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
        if (pos <= min) {
          return pos;
        }
        while (pos > min) {
          if (!isSpace(this.src.charCodeAt(--pos))) {
            return pos + 1;
          }
        }
        return pos;
      };
      StateBlock.prototype.skipChars = function skipChars(pos, code) {
        for (var max = this.src.length; pos < max; pos++) {
          if (this.src.charCodeAt(pos) !== code) {
            break;
          }
        }
        return pos;
      };
      StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
        if (pos <= min) {
          return pos;
        }
        while (pos > min) {
          if (code !== this.src.charCodeAt(--pos)) {
            return pos + 1;
          }
        }
        return pos;
      };
      StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
        var i, lineIndent, ch, first, last, queue, lineStart, line = begin;
        if (begin >= end) {
          return "";
        }
        queue = new Array(end - begin);
        for (i = 0; line < end; line++, i++) {
          lineIndent = 0;
          lineStart = first = this.bMarks[line];
          if (line + 1 < end || keepLastLF) {
            last = this.eMarks[line] + 1;
          } else {
            last = this.eMarks[line];
          }
          while (first < last && lineIndent < indent) {
            ch = this.src.charCodeAt(first);
            if (isSpace(ch)) {
              if (ch === 9) {
                lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
              } else {
                lineIndent++;
              }
            } else if (first - lineStart < this.tShift[line]) {
              lineIndent++;
            } else {
              break;
            }
            first++;
          }
          if (lineIndent > indent) {
            queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
          } else {
            queue[i] = this.src.slice(first, last);
          }
        }
        return queue.join("");
      };
      StateBlock.prototype.Token = Token;
      module.exports = StateBlock;
    }
  });

  // ../../node_modules/markdown-it/lib/parser_block.js
  var require_parser_block = __commonJS({
    "../../node_modules/markdown-it/lib/parser_block.js"(exports, module) {
      "use strict";
      var Ruler = require_ruler();
      var _rules = [
        ["table", require_table(), ["paragraph", "reference"]],
        ["code", require_code()],
        ["fence", require_fence(), ["paragraph", "reference", "blockquote", "list"]],
        ["blockquote", require_blockquote(), ["paragraph", "reference", "blockquote", "list"]],
        ["hr", require_hr(), ["paragraph", "reference", "blockquote", "list"]],
        ["list", require_list(), ["paragraph", "reference", "blockquote"]],
        ["reference", require_reference()],
        ["html_block", require_html_block(), ["paragraph", "reference", "blockquote"]],
        ["heading", require_heading(), ["paragraph", "reference", "blockquote"]],
        ["lheading", require_lheading()],
        ["paragraph", require_paragraph()]
      ];
      function ParserBlock() {
        this.ruler = new Ruler();
        for (var i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
        }
      }
      ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
        var ok, i, rules = this.ruler.getRules(""), len = rules.length, line = startLine, hasEmptyLines = false, maxNesting = state.md.options.maxNesting;
        while (line < endLine) {
          state.line = line = state.skipEmptyLines(line);
          if (line >= endLine) {
            break;
          }
          if (state.sCount[line] < state.blkIndent) {
            break;
          }
          if (state.level >= maxNesting) {
            state.line = endLine;
            break;
          }
          for (i = 0; i < len; i++) {
            ok = rules[i](state, line, endLine, false);
            if (ok) {
              break;
            }
          }
          state.tight = !hasEmptyLines;
          if (state.isEmpty(state.line - 1)) {
            hasEmptyLines = true;
          }
          line = state.line;
          if (line < endLine && state.isEmpty(line)) {
            hasEmptyLines = true;
            line++;
            state.line = line;
          }
        }
      };
      ParserBlock.prototype.parse = function(src, md, env, outTokens) {
        var state;
        if (!src) {
          return;
        }
        state = new this.State(src, md, env, outTokens);
        this.tokenize(state, state.line, state.lineMax);
      };
      ParserBlock.prototype.State = require_state_block();
      module.exports = ParserBlock;
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/text.js
  var require_text = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/text.js"(exports, module) {
      "use strict";
      function isTerminatorChar(ch) {
        switch (ch) {
          case 10:
          case 33:
          case 35:
          case 36:
          case 37:
          case 38:
          case 42:
          case 43:
          case 45:
          case 58:
          case 60:
          case 61:
          case 62:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 125:
          case 126:
            return true;
          default:
            return false;
        }
      }
      module.exports = function text(state, silent) {
        var pos = state.pos;
        while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
          pos++;
        }
        if (pos === state.pos) {
          return false;
        }
        if (!silent) {
          state.pending += state.src.slice(state.pos, pos);
        }
        state.pos = pos;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/newline.js
  var require_newline = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/newline.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      module.exports = function newline(state, silent) {
        var pmax, max, ws, pos = state.pos;
        if (state.src.charCodeAt(pos) !== 10) {
          return false;
        }
        pmax = state.pending.length - 1;
        max = state.posMax;
        if (!silent) {
          if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
            if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
              ws = pmax - 1;
              while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32)
                ws--;
              state.pending = state.pending.slice(0, ws);
              state.push("hardbreak", "br", 0);
            } else {
              state.pending = state.pending.slice(0, -1);
              state.push("softbreak", "br", 0);
            }
          } else {
            state.push("softbreak", "br", 0);
          }
        }
        pos++;
        while (pos < max && isSpace(state.src.charCodeAt(pos))) {
          pos++;
        }
        state.pos = pos;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/escape.js
  var require_escape = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/escape.js"(exports, module) {
      "use strict";
      var isSpace = require_utils().isSpace;
      var ESCAPED = [];
      for (i = 0; i < 256; i++) {
        ESCAPED.push(0);
      }
      var i;
      "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
        ESCAPED[ch.charCodeAt(0)] = 1;
      });
      module.exports = function escape(state, silent) {
        var ch, pos = state.pos, max = state.posMax;
        if (state.src.charCodeAt(pos) !== 92) {
          return false;
        }
        pos++;
        if (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (ch < 256 && ESCAPED[ch] !== 0) {
            if (!silent) {
              state.pending += state.src[pos];
            }
            state.pos += 2;
            return true;
          }
          if (ch === 10) {
            if (!silent) {
              state.push("hardbreak", "br", 0);
            }
            pos++;
            while (pos < max) {
              ch = state.src.charCodeAt(pos);
              if (!isSpace(ch)) {
                break;
              }
              pos++;
            }
            state.pos = pos;
            return true;
          }
        }
        if (!silent) {
          state.pending += "\\";
        }
        state.pos++;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/backticks.js
  var require_backticks = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/backticks.js"(exports, module) {
      "use strict";
      module.exports = function backtick(state, silent) {
        var start, max, marker, token, matchStart, matchEnd, openerLength, closerLength, pos = state.pos, ch = state.src.charCodeAt(pos);
        if (ch !== 96) {
          return false;
        }
        start = pos;
        pos++;
        max = state.posMax;
        while (pos < max && state.src.charCodeAt(pos) === 96) {
          pos++;
        }
        marker = state.src.slice(start, pos);
        openerLength = marker.length;
        if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
          if (!silent)
            state.pending += marker;
          state.pos += openerLength;
          return true;
        }
        matchStart = matchEnd = pos;
        while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
          matchEnd = matchStart + 1;
          while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
            matchEnd++;
          }
          closerLength = matchEnd - matchStart;
          if (closerLength === openerLength) {
            if (!silent) {
              token = state.push("code_inline", "code", 0);
              token.markup = marker;
              token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
            }
            state.pos = matchEnd;
            return true;
          }
          state.backticks[closerLength] = matchStart;
        }
        state.backticksScanned = true;
        if (!silent)
          state.pending += marker;
        state.pos += openerLength;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/strikethrough.js
  var require_strikethrough = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/strikethrough.js"(exports, module) {
      "use strict";
      module.exports.tokenize = function strikethrough(state, silent) {
        var i, scanned, token, len, ch, start = state.pos, marker = state.src.charCodeAt(start);
        if (silent) {
          return false;
        }
        if (marker !== 126) {
          return false;
        }
        scanned = state.scanDelims(state.pos, true);
        len = scanned.length;
        ch = String.fromCharCode(marker);
        if (len < 2) {
          return false;
        }
        if (len % 2) {
          token = state.push("text", "", 0);
          token.content = ch;
          len--;
        }
        for (i = 0; i < len; i += 2) {
          token = state.push("text", "", 0);
          token.content = ch + ch;
          state.delimiters.push({
            marker,
            length: 0,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
          });
        }
        state.pos += scanned.length;
        return true;
      };
      function postProcess(state, delimiters) {
        var i, j, startDelim, endDelim, token, loneMarkers = [], max = delimiters.length;
        for (i = 0; i < max; i++) {
          startDelim = delimiters[i];
          if (startDelim.marker !== 126) {
            continue;
          }
          if (startDelim.end === -1) {
            continue;
          }
          endDelim = delimiters[startDelim.end];
          token = state.tokens[startDelim.token];
          token.type = "s_open";
          token.tag = "s";
          token.nesting = 1;
          token.markup = "~~";
          token.content = "";
          token = state.tokens[endDelim.token];
          token.type = "s_close";
          token.tag = "s";
          token.nesting = -1;
          token.markup = "~~";
          token.content = "";
          if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
            loneMarkers.push(endDelim.token - 1);
          }
        }
        while (loneMarkers.length) {
          i = loneMarkers.pop();
          j = i + 1;
          while (j < state.tokens.length && state.tokens[j].type === "s_close") {
            j++;
          }
          j--;
          if (i !== j) {
            token = state.tokens[j];
            state.tokens[j] = state.tokens[i];
            state.tokens[i] = token;
          }
        }
      }
      module.exports.postProcess = function strikethrough(state) {
        var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
        postProcess(state, state.delimiters);
        for (curr = 0; curr < max; curr++) {
          if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            postProcess(state, tokens_meta[curr].delimiters);
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/emphasis.js
  var require_emphasis = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/emphasis.js"(exports, module) {
      "use strict";
      module.exports.tokenize = function emphasis(state, silent) {
        var i, scanned, token, start = state.pos, marker = state.src.charCodeAt(start);
        if (silent) {
          return false;
        }
        if (marker !== 95 && marker !== 42) {
          return false;
        }
        scanned = state.scanDelims(state.pos, marker === 42);
        for (i = 0; i < scanned.length; i++) {
          token = state.push("text", "", 0);
          token.content = String.fromCharCode(marker);
          state.delimiters.push({
            marker,
            length: scanned.length,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
          });
        }
        state.pos += scanned.length;
        return true;
      };
      function postProcess(state, delimiters) {
        var i, startDelim, endDelim, token, ch, isStrong, max = delimiters.length;
        for (i = max - 1; i >= 0; i--) {
          startDelim = delimiters[i];
          if (startDelim.marker !== 95 && startDelim.marker !== 42) {
            continue;
          }
          if (startDelim.end === -1) {
            continue;
          }
          endDelim = delimiters[startDelim.end];
          isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
          ch = String.fromCharCode(startDelim.marker);
          token = state.tokens[startDelim.token];
          token.type = isStrong ? "strong_open" : "em_open";
          token.tag = isStrong ? "strong" : "em";
          token.nesting = 1;
          token.markup = isStrong ? ch + ch : ch;
          token.content = "";
          token = state.tokens[endDelim.token];
          token.type = isStrong ? "strong_close" : "em_close";
          token.tag = isStrong ? "strong" : "em";
          token.nesting = -1;
          token.markup = isStrong ? ch + ch : ch;
          token.content = "";
          if (isStrong) {
            state.tokens[delimiters[i - 1].token].content = "";
            state.tokens[delimiters[startDelim.end + 1].token].content = "";
            i--;
          }
        }
      }
      module.exports.postProcess = function emphasis(state) {
        var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
        postProcess(state, state.delimiters);
        for (curr = 0; curr < max; curr++) {
          if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            postProcess(state, tokens_meta[curr].delimiters);
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/link.js
  var require_link = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/link.js"(exports, module) {
      "use strict";
      var normalizeReference = require_utils().normalizeReference;
      var isSpace = require_utils().isSpace;
      module.exports = function link(state, silent) {
        var attrs, code, label, labelEnd, labelStart, pos, res, ref, token, href = "", title = "", oldPos = state.pos, max = state.posMax, start = state.pos, parseReference = true;
        if (state.src.charCodeAt(state.pos) !== 91) {
          return false;
        }
        labelStart = state.pos + 1;
        labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
        if (labelEnd < 0) {
          return false;
        }
        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 40) {
          parseReference = false;
          pos++;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          if (pos >= max) {
            return false;
          }
          start = pos;
          res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
          if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) {
              pos = res.pos;
            } else {
              href = "";
            }
            start = pos;
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 10) {
                break;
              }
            }
            res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
            if (pos < max && start !== pos && res.ok) {
              title = res.str;
              pos = res.pos;
              for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos);
                if (!isSpace(code) && code !== 10) {
                  break;
                }
              }
            }
          }
          if (pos >= max || state.src.charCodeAt(pos) !== 41) {
            parseReference = true;
          }
          pos++;
        }
        if (parseReference) {
          if (typeof state.env.references === "undefined") {
            return false;
          }
          if (pos < max && state.src.charCodeAt(pos) === 91) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) {
              label = state.src.slice(start, pos++);
            } else {
              pos = labelEnd + 1;
            }
          } else {
            pos = labelEnd + 1;
          }
          if (!label) {
            label = state.src.slice(labelStart, labelEnd);
          }
          ref = state.env.references[normalizeReference(label)];
          if (!ref) {
            state.pos = oldPos;
            return false;
          }
          href = ref.href;
          title = ref.title;
        }
        if (!silent) {
          state.pos = labelStart;
          state.posMax = labelEnd;
          token = state.push("link_open", "a", 1);
          token.attrs = attrs = [["href", href]];
          if (title) {
            attrs.push(["title", title]);
          }
          state.md.inline.tokenize(state);
          token = state.push("link_close", "a", -1);
        }
        state.pos = pos;
        state.posMax = max;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/image.js
  var require_image = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/image.js"(exports, module) {
      "use strict";
      var normalizeReference = require_utils().normalizeReference;
      var isSpace = require_utils().isSpace;
      module.exports = function image(state, silent) {
        var attrs, code, content, label, labelEnd, labelStart, pos, ref, res, title, token, tokens, start, href = "", oldPos = state.pos, max = state.posMax;
        if (state.src.charCodeAt(state.pos) !== 33) {
          return false;
        }
        if (state.src.charCodeAt(state.pos + 1) !== 91) {
          return false;
        }
        labelStart = state.pos + 2;
        labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
        if (labelEnd < 0) {
          return false;
        }
        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 40) {
          pos++;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          if (pos >= max) {
            return false;
          }
          start = pos;
          res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
          if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) {
              pos = res.pos;
            } else {
              href = "";
            }
          }
          start = pos;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 10) {
                break;
              }
            }
          } else {
            title = "";
          }
          if (pos >= max || state.src.charCodeAt(pos) !== 41) {
            state.pos = oldPos;
            return false;
          }
          pos++;
        } else {
          if (typeof state.env.references === "undefined") {
            return false;
          }
          if (pos < max && state.src.charCodeAt(pos) === 91) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) {
              label = state.src.slice(start, pos++);
            } else {
              pos = labelEnd + 1;
            }
          } else {
            pos = labelEnd + 1;
          }
          if (!label) {
            label = state.src.slice(labelStart, labelEnd);
          }
          ref = state.env.references[normalizeReference(label)];
          if (!ref) {
            state.pos = oldPos;
            return false;
          }
          href = ref.href;
          title = ref.title;
        }
        if (!silent) {
          content = state.src.slice(labelStart, labelEnd);
          state.md.inline.parse(
            content,
            state.md,
            state.env,
            tokens = []
          );
          token = state.push("image", "img", 0);
          token.attrs = attrs = [["src", href], ["alt", ""]];
          token.children = tokens;
          token.content = content;
          if (title) {
            attrs.push(["title", title]);
          }
        }
        state.pos = pos;
        state.posMax = max;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/autolink.js
  var require_autolink = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/autolink.js"(exports, module) {
      "use strict";
      var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
      var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/;
      module.exports = function autolink(state, silent) {
        var url, fullUrl, token, ch, start, max, pos = state.pos;
        if (state.src.charCodeAt(pos) !== 60) {
          return false;
        }
        start = state.pos;
        max = state.posMax;
        for (; ; ) {
          if (++pos >= max)
            return false;
          ch = state.src.charCodeAt(pos);
          if (ch === 60)
            return false;
          if (ch === 62)
            break;
        }
        url = state.src.slice(start + 1, pos);
        if (AUTOLINK_RE.test(url)) {
          fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) {
            return false;
          }
          if (!silent) {
            token = state.push("link_open", "a", 1);
            token.attrs = [["href", fullUrl]];
            token.markup = "autolink";
            token.info = "auto";
            token = state.push("text", "", 0);
            token.content = state.md.normalizeLinkText(url);
            token = state.push("link_close", "a", -1);
            token.markup = "autolink";
            token.info = "auto";
          }
          state.pos += url.length + 2;
          return true;
        }
        if (EMAIL_RE.test(url)) {
          fullUrl = state.md.normalizeLink("mailto:" + url);
          if (!state.md.validateLink(fullUrl)) {
            return false;
          }
          if (!silent) {
            token = state.push("link_open", "a", 1);
            token.attrs = [["href", fullUrl]];
            token.markup = "autolink";
            token.info = "auto";
            token = state.push("text", "", 0);
            token.content = state.md.normalizeLinkText(url);
            token = state.push("link_close", "a", -1);
            token.markup = "autolink";
            token.info = "auto";
          }
          state.pos += url.length + 2;
          return true;
        }
        return false;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/html_inline.js
  var require_html_inline = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/html_inline.js"(exports, module) {
      "use strict";
      var HTML_TAG_RE = require_html_re().HTML_TAG_RE;
      function isLetter(ch) {
        var lc = ch | 32;
        return lc >= 97 && lc <= 122;
      }
      module.exports = function html_inline(state, silent) {
        var ch, match, max, token, pos = state.pos;
        if (!state.md.options.html) {
          return false;
        }
        max = state.posMax;
        if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
          return false;
        }
        ch = state.src.charCodeAt(pos + 1);
        if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
          return false;
        }
        match = state.src.slice(pos).match(HTML_TAG_RE);
        if (!match) {
          return false;
        }
        if (!silent) {
          token = state.push("html_inline", "", 0);
          token.content = state.src.slice(pos, pos + match[0].length);
        }
        state.pos += match[0].length;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/entity.js
  var require_entity = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/entity.js"(exports, module) {
      "use strict";
      var entities = require_entities2();
      var has = require_utils().has;
      var isValidEntityCode = require_utils().isValidEntityCode;
      var fromCodePoint = require_utils().fromCodePoint;
      var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
      var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
      module.exports = function entity(state, silent) {
        var ch, code, match, pos = state.pos, max = state.posMax;
        if (state.src.charCodeAt(pos) !== 38) {
          return false;
        }
        if (pos + 1 < max) {
          ch = state.src.charCodeAt(pos + 1);
          if (ch === 35) {
            match = state.src.slice(pos).match(DIGITAL_RE);
            if (match) {
              if (!silent) {
                code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
                state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(65533);
              }
              state.pos += match[0].length;
              return true;
            }
          } else {
            match = state.src.slice(pos).match(NAMED_RE);
            if (match) {
              if (has(entities, match[1])) {
                if (!silent) {
                  state.pending += entities[match[1]];
                }
                state.pos += match[0].length;
                return true;
              }
            }
          }
        }
        if (!silent) {
          state.pending += "&";
        }
        state.pos++;
        return true;
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/balance_pairs.js
  var require_balance_pairs = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/balance_pairs.js"(exports, module) {
      "use strict";
      function processDelimiters(state, delimiters) {
        var closerIdx, openerIdx, closer, opener, minOpenerIdx, newMinOpenerIdx, isOddMatch, lastJump, openersBottom = {}, max = delimiters.length;
        if (!max)
          return;
        var headerIdx = 0;
        var lastTokenIdx = -2;
        var jumps = [];
        for (closerIdx = 0; closerIdx < max; closerIdx++) {
          closer = delimiters[closerIdx];
          jumps.push(0);
          if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
            headerIdx = closerIdx;
          }
          lastTokenIdx = closer.token;
          closer.length = closer.length || 0;
          if (!closer.close)
            continue;
          if (!openersBottom.hasOwnProperty(closer.marker)) {
            openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
          }
          minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
          openerIdx = headerIdx - jumps[headerIdx] - 1;
          newMinOpenerIdx = openerIdx;
          for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
            opener = delimiters[openerIdx];
            if (opener.marker !== closer.marker)
              continue;
            if (opener.open && opener.end < 0) {
              isOddMatch = false;
              if (opener.close || closer.open) {
                if ((opener.length + closer.length) % 3 === 0) {
                  if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
                    isOddMatch = true;
                  }
                }
              }
              if (!isOddMatch) {
                lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
                jumps[closerIdx] = closerIdx - openerIdx + lastJump;
                jumps[openerIdx] = lastJump;
                closer.open = false;
                opener.end = closerIdx;
                opener.close = false;
                newMinOpenerIdx = -1;
                lastTokenIdx = -2;
                break;
              }
            }
          }
          if (newMinOpenerIdx !== -1) {
            openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
          }
        }
      }
      module.exports = function link_pairs(state) {
        var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
        processDelimiters(state, state.delimiters);
        for (curr = 0; curr < max; curr++) {
          if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            processDelimiters(state, tokens_meta[curr].delimiters);
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/text_collapse.js
  var require_text_collapse = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/text_collapse.js"(exports, module) {
      "use strict";
      module.exports = function text_collapse(state) {
        var curr, last, level = 0, tokens = state.tokens, max = state.tokens.length;
        for (curr = last = 0; curr < max; curr++) {
          if (tokens[curr].nesting < 0)
            level--;
          tokens[curr].level = level;
          if (tokens[curr].nesting > 0)
            level++;
          if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
          } else {
            if (curr !== last) {
              tokens[last] = tokens[curr];
            }
            last++;
          }
        }
        if (curr !== last) {
          tokens.length = last;
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/rules_inline/state_inline.js
  var require_state_inline = __commonJS({
    "../../node_modules/markdown-it/lib/rules_inline/state_inline.js"(exports, module) {
      "use strict";
      var Token = require_token();
      var isWhiteSpace = require_utils().isWhiteSpace;
      var isPunctChar = require_utils().isPunctChar;
      var isMdAsciiPunct = require_utils().isMdAsciiPunct;
      function StateInline(src, md, env, outTokens) {
        this.src = src;
        this.env = env;
        this.md = md;
        this.tokens = outTokens;
        this.tokens_meta = Array(outTokens.length);
        this.pos = 0;
        this.posMax = this.src.length;
        this.level = 0;
        this.pending = "";
        this.pendingLevel = 0;
        this.cache = {};
        this.delimiters = [];
        this._prev_delimiters = [];
        this.backticks = {};
        this.backticksScanned = false;
      }
      StateInline.prototype.pushPending = function() {
        var token = new Token("text", "", 0);
        token.content = this.pending;
        token.level = this.pendingLevel;
        this.tokens.push(token);
        this.pending = "";
        return token;
      };
      StateInline.prototype.push = function(type, tag, nesting) {
        if (this.pending) {
          this.pushPending();
        }
        var token = new Token(type, tag, nesting);
        var token_meta = null;
        if (nesting < 0) {
          this.level--;
          this.delimiters = this._prev_delimiters.pop();
        }
        token.level = this.level;
        if (nesting > 0) {
          this.level++;
          this._prev_delimiters.push(this.delimiters);
          this.delimiters = [];
          token_meta = { delimiters: this.delimiters };
        }
        this.pendingLevel = this.level;
        this.tokens.push(token);
        this.tokens_meta.push(token_meta);
        return token;
      };
      StateInline.prototype.scanDelims = function(start, canSplitWord) {
        var pos = start, lastChar, nextChar, count, can_open, can_close, isLastWhiteSpace, isLastPunctChar, isNextWhiteSpace, isNextPunctChar, left_flanking = true, right_flanking = true, max = this.posMax, marker = this.src.charCodeAt(start);
        lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
        while (pos < max && this.src.charCodeAt(pos) === marker) {
          pos++;
        }
        count = pos - start;
        nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
        isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
        isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
        isLastWhiteSpace = isWhiteSpace(lastChar);
        isNextWhiteSpace = isWhiteSpace(nextChar);
        if (isNextWhiteSpace) {
          left_flanking = false;
        } else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) {
            left_flanking = false;
          }
        }
        if (isLastWhiteSpace) {
          right_flanking = false;
        } else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) {
            right_flanking = false;
          }
        }
        if (!canSplitWord) {
          can_open = left_flanking && (!right_flanking || isLastPunctChar);
          can_close = right_flanking && (!left_flanking || isNextPunctChar);
        } else {
          can_open = left_flanking;
          can_close = right_flanking;
        }
        return {
          can_open,
          can_close,
          length: count
        };
      };
      StateInline.prototype.Token = Token;
      module.exports = StateInline;
    }
  });

  // ../../node_modules/markdown-it/lib/parser_inline.js
  var require_parser_inline = __commonJS({
    "../../node_modules/markdown-it/lib/parser_inline.js"(exports, module) {
      "use strict";
      var Ruler = require_ruler();
      var _rules = [
        ["text", require_text()],
        ["newline", require_newline()],
        ["escape", require_escape()],
        ["backticks", require_backticks()],
        ["strikethrough", require_strikethrough().tokenize],
        ["emphasis", require_emphasis().tokenize],
        ["link", require_link()],
        ["image", require_image()],
        ["autolink", require_autolink()],
        ["html_inline", require_html_inline()],
        ["entity", require_entity()]
      ];
      var _rules2 = [
        ["balance_pairs", require_balance_pairs()],
        ["strikethrough", require_strikethrough().postProcess],
        ["emphasis", require_emphasis().postProcess],
        ["text_collapse", require_text_collapse()]
      ];
      function ParserInline() {
        var i;
        this.ruler = new Ruler();
        for (i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1]);
        }
        this.ruler2 = new Ruler();
        for (i = 0; i < _rules2.length; i++) {
          this.ruler2.push(_rules2[i][0], _rules2[i][1]);
        }
      }
      ParserInline.prototype.skipToken = function(state) {
        var ok, i, pos = state.pos, rules = this.ruler.getRules(""), len = rules.length, maxNesting = state.md.options.maxNesting, cache = state.cache;
        if (typeof cache[pos] !== "undefined") {
          state.pos = cache[pos];
          return;
        }
        if (state.level < maxNesting) {
          for (i = 0; i < len; i++) {
            state.level++;
            ok = rules[i](state, true);
            state.level--;
            if (ok) {
              break;
            }
          }
        } else {
          state.pos = state.posMax;
        }
        if (!ok) {
          state.pos++;
        }
        cache[pos] = state.pos;
      };
      ParserInline.prototype.tokenize = function(state) {
        var ok, i, rules = this.ruler.getRules(""), len = rules.length, end = state.posMax, maxNesting = state.md.options.maxNesting;
        while (state.pos < end) {
          if (state.level < maxNesting) {
            for (i = 0; i < len; i++) {
              ok = rules[i](state, false);
              if (ok) {
                break;
              }
            }
          }
          if (ok) {
            if (state.pos >= end) {
              break;
            }
            continue;
          }
          state.pending += state.src[state.pos++];
        }
        if (state.pending) {
          state.pushPending();
        }
      };
      ParserInline.prototype.parse = function(str, md, env, outTokens) {
        var i, rules, len;
        var state = new this.State(str, md, env, outTokens);
        this.tokenize(state);
        rules = this.ruler2.getRules("");
        len = rules.length;
        for (i = 0; i < len; i++) {
          rules[i](state);
        }
      };
      ParserInline.prototype.State = require_state_inline();
      module.exports = ParserInline;
    }
  });

  // ../../node_modules/linkify-it/lib/re.js
  var require_re = __commonJS({
    "../../node_modules/linkify-it/lib/re.js"(exports, module) {
      "use strict";
      module.exports = function(opts) {
        var re = {};
        re.src_Any = require_regex2().source;
        re.src_Cc = require_regex3().source;
        re.src_Z = require_regex5().source;
        re.src_P = require_regex().source;
        re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join("|");
        re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
        var text_separators = "[><\uFF5C]";
        re.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re.src_ZPCc + ")" + re.src_Any + ")";
        re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
        re.src_auth = "(?:(?:(?!" + re.src_ZCc + "|[@/\\[\\]()]).)+@)?";
        re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
        re.src_host_terminator = "(?=$|" + text_separators + "|" + re.src_ZPCc + ")(?!-|_|:\\d|\\.-|\\.(?!$|" + re.src_ZPCc + "))";
        re.src_path = "(?:[/?#](?:(?!" + re.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re.src_ZCc + "|[']).)+\\'|\\'(?=" + re.src_pseudo_letter + "|[-]).|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re.src_ZCc + "|[.]).|" + (opts && opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + re.src_ZCc + ").|;(?!" + re.src_ZCc + ").|\\!+(?!" + re.src_ZCc + "|[!]).|\\?(?!" + re.src_ZCc + "|[?]).)+|\\/)?";
        re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
        re.src_xn = "xn--[a-z0-9\\-]{1,59}";
        re.src_domain_root = "(?:" + re.src_xn + "|" + re.src_pseudo_letter + "{1,63})";
        re.src_domain = "(?:" + re.src_xn + "|(?:" + re.src_pseudo_letter + ")|(?:" + re.src_pseudo_letter + "(?:-|" + re.src_pseudo_letter + "){0,61}" + re.src_pseudo_letter + "))";
        re.src_host = "(?:(?:(?:(?:" + re.src_domain + ")\\.)*" + re.src_domain + "))";
        re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%)))";
        re.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))";
        re.src_host_strict = re.src_host + re.src_host_terminator;
        re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
        re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
        re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
        re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
        re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re.src_ZPCc + "|>|$))";
        re.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re.src_ZCc + ")(" + re.src_email_name + "@" + re.tpl_host_fuzzy_strict + ")";
        re.tpl_link_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_fuzzy_strict + re.src_path + ")";
        re.tpl_link_no_ip_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ")";
        return re;
      };
    }
  });

  // ../../node_modules/linkify-it/index.js
  var require_linkify_it = __commonJS({
    "../../node_modules/linkify-it/index.js"(exports, module) {
      "use strict";
      function assign(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(source) {
          if (!source) {
            return;
          }
          Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
          });
        });
        return obj;
      }
      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }
      function isString(obj) {
        return _class(obj) === "[object String]";
      }
      function isObject(obj) {
        return _class(obj) === "[object Object]";
      }
      function isRegExp(obj) {
        return _class(obj) === "[object RegExp]";
      }
      function isFunction(obj) {
        return _class(obj) === "[object Function]";
      }
      function escapeRE(str) {
        return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
      }
      var defaultOptions = {
        fuzzyLink: true,
        fuzzyEmail: true,
        fuzzyIP: false
      };
      function isOptionsObj(obj) {
        return Object.keys(obj || {}).reduce(function(acc, k) {
          return acc || defaultOptions.hasOwnProperty(k);
        }, false);
      }
      var defaultSchemas = {
        "http:": {
          validate: function(text, pos, self) {
            var tail = text.slice(pos);
            if (!self.re.http) {
              self.re.http = new RegExp(
                "^\\/\\/" + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path,
                "i"
              );
            }
            if (self.re.http.test(tail)) {
              return tail.match(self.re.http)[0].length;
            }
            return 0;
          }
        },
        "https:": "http:",
        "ftp:": "http:",
        "//": {
          validate: function(text, pos, self) {
            var tail = text.slice(pos);
            if (!self.re.no_http) {
              self.re.no_http = new RegExp(
                "^" + self.re.src_auth + "(?:localhost|(?:(?:" + self.re.src_domain + ")\\.)+" + self.re.src_domain_root + ")" + self.re.src_port + self.re.src_host_terminator + self.re.src_path,
                "i"
              );
            }
            if (self.re.no_http.test(tail)) {
              if (pos >= 3 && text[pos - 3] === ":") {
                return 0;
              }
              if (pos >= 3 && text[pos - 3] === "/") {
                return 0;
              }
              return tail.match(self.re.no_http)[0].length;
            }
            return 0;
          }
        },
        "mailto:": {
          validate: function(text, pos, self) {
            var tail = text.slice(pos);
            if (!self.re.mailto) {
              self.re.mailto = new RegExp(
                "^" + self.re.src_email_name + "@" + self.re.src_host_strict,
                "i"
              );
            }
            if (self.re.mailto.test(tail)) {
              return tail.match(self.re.mailto)[0].length;
            }
            return 0;
          }
        }
      };
      var tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
      var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|\u0440\u0444".split("|");
      function resetScanCache(self) {
        self.__index__ = -1;
        self.__text_cache__ = "";
      }
      function createValidator(re) {
        return function(text, pos) {
          var tail = text.slice(pos);
          if (re.test(tail)) {
            return tail.match(re)[0].length;
          }
          return 0;
        };
      }
      function createNormalizer() {
        return function(match, self) {
          self.normalize(match);
        };
      }
      function compile(self) {
        var re = self.re = require_re()(self.__opts__);
        var tlds = self.__tlds__.slice();
        self.onCompile();
        if (!self.__tlds_replaced__) {
          tlds.push(tlds_2ch_src_re);
        }
        tlds.push(re.src_xn);
        re.src_tlds = tlds.join("|");
        function untpl(tpl) {
          return tpl.replace("%TLDS%", re.src_tlds);
        }
        re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
        re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
        re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
        re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
        var aliases = [];
        self.__compiled__ = {};
        function schemaError(name, val) {
          throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
        }
        Object.keys(self.__schemas__).forEach(function(name) {
          var val = self.__schemas__[name];
          if (val === null) {
            return;
          }
          var compiled = { validate: null, link: null };
          self.__compiled__[name] = compiled;
          if (isObject(val)) {
            if (isRegExp(val.validate)) {
              compiled.validate = createValidator(val.validate);
            } else if (isFunction(val.validate)) {
              compiled.validate = val.validate;
            } else {
              schemaError(name, val);
            }
            if (isFunction(val.normalize)) {
              compiled.normalize = val.normalize;
            } else if (!val.normalize) {
              compiled.normalize = createNormalizer();
            } else {
              schemaError(name, val);
            }
            return;
          }
          if (isString(val)) {
            aliases.push(name);
            return;
          }
          schemaError(name, val);
        });
        aliases.forEach(function(alias) {
          if (!self.__compiled__[self.__schemas__[alias]]) {
            return;
          }
          self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
          self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
        });
        self.__compiled__[""] = { validate: null, normalize: createNormalizer() };
        var slist = Object.keys(self.__compiled__).filter(function(name) {
          return name.length > 0 && self.__compiled__[name];
        }).map(escapeRE).join("|");
        self.re.schema_test = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "i");
        self.re.schema_search = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "ig");
        self.re.pretest = RegExp(
          "(" + self.re.schema_test.source + ")|(" + self.re.host_fuzzy_test.source + ")|@",
          "i"
        );
        resetScanCache(self);
      }
      function Match(self, shift) {
        var start = self.__index__, end = self.__last_index__, text = self.__text_cache__.slice(start, end);
        this.schema = self.__schema__.toLowerCase();
        this.index = start + shift;
        this.lastIndex = end + shift;
        this.raw = text;
        this.text = text;
        this.url = text;
      }
      function createMatch(self, shift) {
        var match = new Match(self, shift);
        self.__compiled__[match.schema].normalize(match, self);
        return match;
      }
      function LinkifyIt(schemas, options) {
        if (!(this instanceof LinkifyIt)) {
          return new LinkifyIt(schemas, options);
        }
        if (!options) {
          if (isOptionsObj(schemas)) {
            options = schemas;
            schemas = {};
          }
        }
        this.__opts__ = assign({}, defaultOptions, options);
        this.__index__ = -1;
        this.__last_index__ = -1;
        this.__schema__ = "";
        this.__text_cache__ = "";
        this.__schemas__ = assign({}, defaultSchemas, schemas);
        this.__compiled__ = {};
        this.__tlds__ = tlds_default;
        this.__tlds_replaced__ = false;
        this.re = {};
        compile(this);
      }
      LinkifyIt.prototype.add = function add(schema, definition) {
        this.__schemas__[schema] = definition;
        compile(this);
        return this;
      };
      LinkifyIt.prototype.set = function set(options) {
        this.__opts__ = assign(this.__opts__, options);
        return this;
      };
      LinkifyIt.prototype.test = function test(text) {
        this.__text_cache__ = text;
        this.__index__ = -1;
        if (!text.length) {
          return false;
        }
        var m, ml, me, len, shift, next, re, tld_pos, at_pos;
        if (this.re.schema_test.test(text)) {
          re = this.re.schema_search;
          re.lastIndex = 0;
          while ((m = re.exec(text)) !== null) {
            len = this.testSchemaAt(text, m[2], re.lastIndex);
            if (len) {
              this.__schema__ = m[2];
              this.__index__ = m.index + m[1].length;
              this.__last_index__ = m.index + m[0].length + len;
              break;
            }
          }
        }
        if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
          tld_pos = text.search(this.re.host_fuzzy_test);
          if (tld_pos >= 0) {
            if (this.__index__ < 0 || tld_pos < this.__index__) {
              if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
                shift = ml.index + ml[1].length;
                if (this.__index__ < 0 || shift < this.__index__) {
                  this.__schema__ = "";
                  this.__index__ = shift;
                  this.__last_index__ = ml.index + ml[0].length;
                }
              }
            }
          }
        }
        if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
          at_pos = text.indexOf("@");
          if (at_pos >= 0) {
            if ((me = text.match(this.re.email_fuzzy)) !== null) {
              shift = me.index + me[1].length;
              next = me.index + me[0].length;
              if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
                this.__schema__ = "mailto:";
                this.__index__ = shift;
                this.__last_index__ = next;
              }
            }
          }
        }
        return this.__index__ >= 0;
      };
      LinkifyIt.prototype.pretest = function pretest(text) {
        return this.re.pretest.test(text);
      };
      LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
        if (!this.__compiled__[schema.toLowerCase()]) {
          return 0;
        }
        return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
      };
      LinkifyIt.prototype.match = function match(text) {
        var shift = 0, result = [];
        if (this.__index__ >= 0 && this.__text_cache__ === text) {
          result.push(createMatch(this, shift));
          shift = this.__last_index__;
        }
        var tail = shift ? text.slice(shift) : text;
        while (this.test(tail)) {
          result.push(createMatch(this, shift));
          tail = tail.slice(this.__last_index__);
          shift += this.__last_index__;
        }
        if (result.length) {
          return result;
        }
        return null;
      };
      LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
        list = Array.isArray(list) ? list : [list];
        if (!keepOld) {
          this.__tlds__ = list.slice();
          this.__tlds_replaced__ = true;
          compile(this);
          return this;
        }
        this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
          return el !== arr[idx - 1];
        }).reverse();
        compile(this);
        return this;
      };
      LinkifyIt.prototype.normalize = function normalize(match) {
        if (!match.schema) {
          match.url = "http://" + match.url;
        }
        if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
          match.url = "mailto:" + match.url;
        }
      };
      LinkifyIt.prototype.onCompile = function onCompile() {
      };
      module.exports = LinkifyIt;
    }
  });

  // ../../node_modules/punycode/punycode.js
  var require_punycode = __commonJS({
    "../../node_modules/punycode/punycode.js"(exports, module) {
      "use strict";
      var maxInt = 2147483647;
      var base = 36;
      var tMin = 1;
      var tMax = 26;
      var skew = 38;
      var damp = 700;
      var initialBias = 72;
      var initialN = 128;
      var delimiter = "-";
      var regexPunycode = /^xn--/;
      var regexNonASCII = /[^\0-\x7F]/;
      var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
      var errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      };
      var baseMinusTMin = base - tMin;
      var floor = Math.floor;
      var stringFromCharCode = String.fromCharCode;
      function error(type) {
        throw new RangeError(errors[type]);
      }
      function map(array, callback) {
        const result = [];
        let length = array.length;
        while (length--) {
          result[length] = callback(array[length]);
        }
        return result;
      }
      function mapDomain(domain, callback) {
        const parts = domain.split("@");
        let result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          domain = parts[1];
        }
        domain = domain.replace(regexSeparators, ".");
        const labels = domain.split(".");
        const encoded = map(labels, callback).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        const output = [];
        let counter = 0;
        const length = string.length;
        while (counter < length) {
          const value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            const extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
      var basicToDigit = function(codePoint) {
        if (codePoint >= 48 && codePoint < 58) {
          return 26 + (codePoint - 48);
        }
        if (codePoint >= 65 && codePoint < 91) {
          return codePoint - 65;
        }
        if (codePoint >= 97 && codePoint < 123) {
          return codePoint - 97;
        }
        return base;
      };
      var digitToBasic = function(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      };
      var adapt = function(delta, numPoints, firstTime) {
        let k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      };
      var decode2 = function(input) {
        const output = [];
        const inputLength = input.length;
        let i = 0;
        let n = initialN;
        let bias = initialBias;
        let basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (let j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          const oldi = i;
          for (let w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            const digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base) {
              error("invalid-input");
            }
            if (digit > floor((maxInt - i) / w)) {
              error("overflow");
            }
            i += digit * w;
            const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            const baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          const out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return String.fromCodePoint(...output);
      };
      var encode2 = function(input) {
        const output = [];
        input = ucs2decode(input);
        const inputLength = input.length;
        let n = initialN;
        let delta = 0;
        let bias = initialBias;
        for (const currentValue of input) {
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        const basicLength = output.length;
        let handledCPCount = basicLength;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          let m = maxInt;
          for (const currentValue of input) {
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          const handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (const currentValue of input) {
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue === n) {
              let q = delta;
              for (let k = base; ; k += base) {
                const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                const qMinusT = q - t;
                const baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      };
      var toUnicode = function(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode2(string.slice(4).toLowerCase()) : string;
        });
      };
      var toASCII = function(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode2(string) : string;
        });
      };
      var punycode = {
        "version": "2.1.0",
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode2,
        "encode": encode2,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      module.exports = punycode;
    }
  });

  // ../../node_modules/markdown-it/lib/presets/default.js
  var require_default = __commonJS({
    "../../node_modules/markdown-it/lib/presets/default.js"(exports, module) {
      "use strict";
      module.exports = {
        options: {
          html: false,
          xhtmlOut: false,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: null,
          maxNesting: 100
        },
        components: {
          core: {},
          block: {},
          inline: {}
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/presets/zero.js
  var require_zero = __commonJS({
    "../../node_modules/markdown-it/lib/presets/zero.js"(exports, module) {
      "use strict";
      module.exports = {
        options: {
          html: false,
          xhtmlOut: false,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: null,
          maxNesting: 20
        },
        components: {
          core: {
            rules: [
              "normalize",
              "block",
              "inline"
            ]
          },
          block: {
            rules: [
              "paragraph"
            ]
          },
          inline: {
            rules: [
              "text"
            ],
            rules2: [
              "balance_pairs",
              "text_collapse"
            ]
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/presets/commonmark.js
  var require_commonmark = __commonJS({
    "../../node_modules/markdown-it/lib/presets/commonmark.js"(exports, module) {
      "use strict";
      module.exports = {
        options: {
          html: true,
          xhtmlOut: true,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: null,
          maxNesting: 20
        },
        components: {
          core: {
            rules: [
              "normalize",
              "block",
              "inline"
            ]
          },
          block: {
            rules: [
              "blockquote",
              "code",
              "fence",
              "heading",
              "hr",
              "html_block",
              "lheading",
              "list",
              "reference",
              "paragraph"
            ]
          },
          inline: {
            rules: [
              "autolink",
              "backticks",
              "emphasis",
              "entity",
              "escape",
              "html_inline",
              "image",
              "link",
              "newline",
              "text"
            ],
            rules2: [
              "balance_pairs",
              "emphasis",
              "text_collapse"
            ]
          }
        }
      };
    }
  });

  // ../../node_modules/markdown-it/lib/index.js
  var require_lib2 = __commonJS({
    "../../node_modules/markdown-it/lib/index.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var helpers = require_helpers();
      var Renderer = require_renderer();
      var ParserCore = require_parser_core();
      var ParserBlock = require_parser_block();
      var ParserInline = require_parser_inline();
      var LinkifyIt = require_linkify_it();
      var mdurl = require_mdurl();
      var punycode = require_punycode();
      var config = {
        default: require_default(),
        zero: require_zero(),
        commonmark: require_commonmark()
      };
      var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
      var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
      function validateLink(url) {
        var str = url.trim().toLowerCase();
        return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) ? true : false : true;
      }
      var RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
      function normalizeLink(url) {
        var parsed = mdurl.parse(url, true);
        if (parsed.hostname) {
          if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
            try {
              parsed.hostname = punycode.toASCII(parsed.hostname);
            } catch (er) {
            }
          }
        }
        return mdurl.encode(mdurl.format(parsed));
      }
      function normalizeLinkText(url) {
        var parsed = mdurl.parse(url, true);
        if (parsed.hostname) {
          if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
            try {
              parsed.hostname = punycode.toUnicode(parsed.hostname);
            } catch (er) {
            }
          }
        }
        return mdurl.decode(mdurl.format(parsed), mdurl.decode.defaultChars + "%");
      }
      function MarkdownIt2(presetName, options) {
        if (!(this instanceof MarkdownIt2)) {
          return new MarkdownIt2(presetName, options);
        }
        if (!options) {
          if (!utils.isString(presetName)) {
            options = presetName || {};
            presetName = "default";
          }
        }
        this.inline = new ParserInline();
        this.block = new ParserBlock();
        this.core = new ParserCore();
        this.renderer = new Renderer();
        this.linkify = new LinkifyIt();
        this.validateLink = validateLink;
        this.normalizeLink = normalizeLink;
        this.normalizeLinkText = normalizeLinkText;
        this.utils = utils;
        this.helpers = utils.assign({}, helpers);
        this.options = {};
        this.configure(presetName);
        if (options) {
          this.set(options);
        }
      }
      MarkdownIt2.prototype.set = function(options) {
        utils.assign(this.options, options);
        return this;
      };
      MarkdownIt2.prototype.configure = function(presets) {
        var self = this, presetName;
        if (utils.isString(presets)) {
          presetName = presets;
          presets = config[presetName];
          if (!presets) {
            throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
          }
        }
        if (!presets) {
          throw new Error("Wrong `markdown-it` preset, can't be empty");
        }
        if (presets.options) {
          self.set(presets.options);
        }
        if (presets.components) {
          Object.keys(presets.components).forEach(function(name) {
            if (presets.components[name].rules) {
              self[name].ruler.enableOnly(presets.components[name].rules);
            }
            if (presets.components[name].rules2) {
              self[name].ruler2.enableOnly(presets.components[name].rules2);
            }
          });
        }
        return this;
      };
      MarkdownIt2.prototype.enable = function(list, ignoreInvalid) {
        var result = [];
        if (!Array.isArray(list)) {
          list = [list];
        }
        ["core", "block", "inline"].forEach(function(chain) {
          result = result.concat(this[chain].ruler.enable(list, true));
        }, this);
        result = result.concat(this.inline.ruler2.enable(list, true));
        var missed = list.filter(function(name) {
          return result.indexOf(name) < 0;
        });
        if (missed.length && !ignoreInvalid) {
          throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
        }
        return this;
      };
      MarkdownIt2.prototype.disable = function(list, ignoreInvalid) {
        var result = [];
        if (!Array.isArray(list)) {
          list = [list];
        }
        ["core", "block", "inline"].forEach(function(chain) {
          result = result.concat(this[chain].ruler.disable(list, true));
        }, this);
        result = result.concat(this.inline.ruler2.disable(list, true));
        var missed = list.filter(function(name) {
          return result.indexOf(name) < 0;
        });
        if (missed.length && !ignoreInvalid) {
          throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
        }
        return this;
      };
      MarkdownIt2.prototype.use = function(plugin) {
        var args = [this].concat(Array.prototype.slice.call(arguments, 1));
        plugin.apply(plugin, args);
        return this;
      };
      MarkdownIt2.prototype.parse = function(src, env) {
        if (typeof src !== "string") {
          throw new Error("Input data should be a String");
        }
        var state = new this.core.State(src, this, env);
        this.core.process(state);
        return state.tokens;
      };
      MarkdownIt2.prototype.render = function(src, env) {
        env = env || {};
        return this.renderer.render(this.parse(src, env), this.options, env);
      };
      MarkdownIt2.prototype.parseInline = function(src, env) {
        var state = new this.core.State(src, this, env);
        state.inlineMode = true;
        this.core.process(state);
        return state.tokens;
      };
      MarkdownIt2.prototype.renderInline = function(src, env) {
        env = env || {};
        return this.renderer.render(this.parseInline(src, env), this.options, env);
      };
      module.exports = MarkdownIt2;
    }
  });

  // ../../node_modules/markdown-it/index.js
  var require_markdown_it = __commonJS({
    "../../node_modules/markdown-it/index.js"(exports, module) {
      "use strict";
      module.exports = require_lib2();
    }
  });

  // ../@blognami/util/lib/class.js
  var Class = class {
    static extend() {
      return class extends this {
      };
    }
    static include(...includes) {
      includes.forEach((include) => {
        if (typeof include.meta == "function")
          include.meta.call(this);
        this.prototype.assignProps(include, (name) => name != "meta");
      });
      return this;
    }
    static assignProps(...sources) {
      return assignProps(this, ...sources);
    }
    static new(...args) {
      return new this(...args);
    }
    static get parent() {
      return this.__proto__;
    }
    constructor(...args) {
      let out = this.initialize(...args);
      if (typeof out?.then == "function") {
        return out.then((out2) => out2 || this);
      }
      return out || this;
    }
    initialize() {
    }
    assignProps(...sources) {
      return assignProps(this, ...sources);
    }
  };
  var assignProps = (target, ...sources) => {
    const fn = typeof sources[sources.length - 1] == "function" ? sources.pop() : () => true;
    sources.forEach((source) => {
      Object.getOwnPropertyNames(source).forEach((name) => {
        if (!fn(name)) {
          return;
        }
        const descriptor = { ...Object.getOwnPropertyDescriptor(source, name) };
        const { get: targetGet, set: targetSet } = Object.getOwnPropertyDescriptor(target, name) || {};
        const { get = targetGet, set = targetSet } = descriptor;
        if (get)
          descriptor.get = get;
        if (set)
          descriptor.set = set;
        Object.defineProperty(target, name, descriptor);
      });
    });
    return target;
  };

  // ../@blognami/util/lib/constants.js
  var SELF_CLOSING_TAGS = [
    "area",
    "base",
    "br",
    "embed",
    "hr",
    "iframe",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "slot",
    "source",
    "track"
  ];
  var TEXT_ONLY_TAGS = [
    "script",
    "style"
  ];
  var IS_SERVER = typeof window == "undefined";

  // ../@blognami/util/lib/escape_html.js
  var import_html_entities = __toESM(require_lib(), 1);

  // ../@blognami/util/lib/singleton.js
  var Singleton = {
    meta() {
      this.assignProps({
        get instance() {
          if (!this.hasOwnProperty("_instance")) {
            this._instance = this.new();
          }
          return this._instance;
        }
      });
    }
  };

  // ../@blognami/util/lib/inflector.js
  var Inflector = Class.extend().include({
    meta() {
      this.include(Singleton);
    },
    initialize() {
      this.pluralizeRules = [];
      this.singularizeRules = [];
      this.definePlural(/$/, "s");
      this.definePlural(/s$/i, "s");
      this.definePlural(/^(ax|test)is$/i, "$1es");
      this.definePlural(/(octop|vir)us$/i, "$1i");
      this.definePlural(/(octop|vir)i$/i, "$1i");
      this.definePlural(/(alias|status)$/i, "$1es");
      this.definePlural(/(bu)s$/i, "$1ses");
      this.definePlural(/(buffal|tomat)o$/i, "$1oes");
      this.definePlural(/([ti])um$/i, "$1a");
      this.definePlural(/([ti])a$/i, "$1a");
      this.definePlural(/sis$/i, "ses");
      this.definePlural(/(?:([^f])fe|([lr])f)$/i, "$1$2ves");
      this.definePlural(/(hive)$/i, "$1s");
      this.definePlural(/([^aeiouy]|qu)y$/i, "$1ies");
      this.definePlural(/(x|ch|ss|sh)$/i, "$1es");
      this.definePlural(/(matr|vert|ind)(?:ix|ex)$/i, "$1ices");
      this.definePlural(/^(m|l)ouse$/i, "$1ice");
      this.definePlural(/^(m|l)ice$/i, "$1ice");
      this.definePlural(/^(ox)$/i, "$1en");
      this.definePlural(/^(oxen)$/i, "$1");
      this.definePlural(/(quiz)$/i, "$1zes");
      this.defineSingular(/s$/i, "");
      this.defineSingular(/(ss)$/i, "$1");
      this.defineSingular(/(n)ews$/i, "$1ews");
      this.defineSingular(/([ti])a$/i, "$1um");
      this.defineSingular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, "$1sis");
      this.defineSingular(/(^analy)(sis|ses)$/i, "$1sis");
      this.defineSingular(/([^f])ves$/i, "$1fe");
      this.defineSingular(/(hive)s$/i, "$1");
      this.defineSingular(/(tive)s$/i, "$1");
      this.defineSingular(/([lr])ves$/i, "$1f");
      this.defineSingular(/([^aeiouy]|qu)ies$/i, "$1y");
      this.defineSingular(/(s)eries$/i, "$1eries");
      this.defineSingular(/(m)ovies$/i, "$1ovie");
      this.defineSingular(/(x|ch|ss|sh)es$/i, "$1");
      this.defineSingular(/^(m|l)ice$/i, "$1ouse");
      this.defineSingular(/(bus)(es)?$/i, "$1");
      this.defineSingular(/(o)es$/i, "$1");
      this.defineSingular(/(shoe)s$/i, "$1");
      this.defineSingular(/(cris|test)(is|es)$/i, "$1is");
      this.defineSingular(/^(a)x[ie]s$/i, "$1xis");
      this.defineSingular(/(octop|vir)(us|i)$/i, "$1us");
      this.defineSingular(/(alias|status)(es)?$/i, "$1");
      this.defineSingular(/^(ox)en/i, "$1");
      this.defineSingular(/(vert|ind)ices$/i, "$1ex");
      this.defineSingular(/(matr)ices$/i, "$1ix");
      this.defineSingular(/(quiz)zes$/i, "$1");
      this.defineSingular(/(database)s$/i, "$1");
      this.defineIrregular("person", "people");
      this.defineIrregular("man", "men");
      this.defineIrregular("child", "children");
      this.defineIrregular("sex", "sexes");
      this.defineIrregular("move", "moves");
      this.defineIrregular("zombie", "zombies");
      this.defineUncountable("equipment");
      this.defineUncountable("information");
      this.defineUncountable("rice");
      this.defineUncountable("money");
      this.defineUncountable("species");
      this.defineUncountable("series");
      this.defineUncountable("fish");
      this.defineUncountable("sheep");
      this.defineUncountable("jeans");
      this.defineUncountable("police");
    },
    definePlural(...args) {
      this.pluralizeRules.unshift(args);
    },
    defineSingular(...args) {
      this.singularizeRules.unshift(args);
    },
    defineIrregular(singular, plural) {
      const s0 = singular[0];
      const srest = singular.substr(1);
      const p0 = plural[0];
      const prest = plural.substr(1);
      if (s0.toUpperCase() == p0.toUpperCase()) {
        this.definePlural(new RegExp(`(${s0})${srest}$`, "i"), `$1${prest}`);
        this.definePlural(new RegExp(`(${p0})${prest}$`, "i"), `$1${prest}`);
        this.defineSingular(new RegExp(`(${s0})${srest}$`, "i"), `$1${srest}`);
        this.defineSingular(new RegExp(`(${p0})${prest}$`, "i"), `$1${srest}`);
      } else {
        this.definePlural(new RegExp(`${s0.toUpperCase()}${caseInsensitive(srest)}$`), `${p0.toUpperCase()}${prest}`);
        this.definePlural(new RegExp(`${s0.toLowerCase()}${caseInsensitive(srest)}$`), `${p0.toLowerCase()}${prest}`);
        this.definePlural(new RegExp(`${p0.toUpperCase()}${caseInsensitive(prest)}$`), `${p0.toUpperCase()}${prest}`);
        this.definePlural(new RegExp(`${p0.toLowerCase()}${caseInsensitive(prest)}$`), `${p0.toLowerCase()}${prest}`);
        this.defineSingular(new RegExp(`${s0.toUpperCase()}${caseInsensitive(srest)}$`), `${s0.toUpperCase()}${srest}`);
        this.defineSingular(new RegExp(`${s0.toLowerCase()}${caseInsensitive(srest)}$`), `${s0.toLowerCase()}${srest}`);
        this.defineSingular(new RegExp(`${p0.toUpperCase()}${caseInsensitive(prest)}$`), `${s0.toUpperCase()}${srest}`);
        this.defineSingular(new RegExp(`${p0.toLowerCase()}${caseInsensitive(prest)}$`), `${s0.toLowerCase()}${srest}`);
      }
    },
    defineUncountable(singularAndPlural) {
      this.defineIrregular(singularAndPlural, singularAndPlural);
    },
    pluralize(word) {
      word = `${word}`;
      for (let i in this.pluralizeRules) {
        const [pattern, replacement] = this.pluralizeRules[i];
        if (word.match(pattern)) {
          return word.replace(pattern, replacement);
        }
      }
    },
    singularize(word) {
      word = `${word}`;
      for (let i in this.singularizeRules) {
        const [pattern, replacement] = this.singularizeRules[i];
        if (word.match(pattern)) {
          return word.replace(pattern, replacement);
        }
      }
    },
    snakeify(stringable) {
      return `${stringable}`.split(/\//).map(
        (segment) => segment.replace(/([A-Z])/g, "_$1").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "")
      ).join("/");
    },
    dasherize(stringable) {
      return this.snakeify(stringable).replace(/_/g, "-");
    },
    capitalize(stringable) {
      const [first, ...rest] = `${stringable}`;
      return `${first.toLocaleUpperCase()}${rest.join("")}`;
    },
    uncapitalize(stringable) {
      const [first, ...rest] = `${stringable}`;
      return `${first.toLocaleLowerCase()}${rest.join("")}`;
    },
    pascalize(stringable) {
      return this.snakeify(stringable).replace(/^[0-9]+/, "").split(/[^a-z0-9]+/).map((word) => this.capitalize(word)).join("");
    },
    camelize(stringable) {
      return this.uncapitalize(this.pascalize(stringable));
    }
  });
  var caseInsensitive = (string) => string.replace(/[a-z]/gi, (c) => `[${c.toUpperCase()}${c.toLowerCase()}]`);
  var inflector = Inflector.instance;

  // ../@blognami/util/lib/lru_cache.js
  var LruCache = Class.extend().include({
    meta() {
      this.assignProps({
        maxEntries: 1e3
      });
    },
    initialize() {
      this.entries = {};
      this.index = [];
    },
    put(key, value) {
      if (!this.entries[key]) {
        this.entries[key] = { key, position: this.index.length };
        this.index.push(this.entries[key]);
        this.promote(key);
        this.evict();
      }
      this.entries[key].value = value;
    },
    get(key) {
      const entry = this.entries[key];
      if (!entry)
        return;
      this.promote(key);
      return entry.value;
    },
    hasEntry(key) {
      return !!this.entries[key];
    },
    promote(key) {
      const entry = this.entries[key];
      if (!entry || entry.position == 0)
        return;
      const previousEntry = this.index[entry.position - 1];
      this.index[entry.position] = previousEntry;
      this.index[previousEntry.position] = entry;
      previousEntry.position++;
      entry.position--;
    },
    evict() {
      while (this.index.length > this.constructor.maxEntries) {
        const entry = this.index.pop();
        delete this.entries[entry.key];
      }
    }
  });

  // ../@blognami/util/lib/registry.js
  var registries = {};
  var Registry = {
    meta() {
      registries[this.name] = this;
      const { include } = this;
      this.assignProps({
        registry: this,
        mixins: {},
        cache: {},
        get names() {
          return Object.keys(this.mixins).sort();
        },
        get includedIn() {
          const out = [];
          this.names.forEach((name) => {
            if (this.for(name).includes.includes(this.name) && !out.includes(name)) {
              out.push(name);
            }
          });
          return out;
        },
        normalizeName(name) {
          return name;
        },
        normalizeMixin(name, mixin, previousMixin) {
          return {
            meta() {
              if (previousMixin)
                this.include(previousMixin);
              this.include(mixin);
            }
          };
        },
        register(name, mixin = {}) {
          const normalizedName = this.normalizeName(name);
          this.mixins[normalizedName] = this.normalizeMixin(normalizedName, mixin, this.mixins[normalizedName]);
          this.clearCache();
        },
        unregister(name) {
          const normalizedName = this.normalizeName(name);
          delete this.mixins[normalizedName];
        },
        clearCache() {
          this.registry.cache = {};
        },
        createInitialMixin(name) {
          return {};
        },
        for(name) {
          const normalizedName = this.normalizeName(name);
          if (!this.cache.classes)
            this.cache.classes = {};
          const { classes } = this.cache;
          if (!classes[normalizedName]) {
            classes[normalizedName] = this.registry.extend().include({
              meta() {
                this.assignProps({ name: normalizedName, includes: [], filePaths: [] });
                this.include(this.createInitialMixin(normalizedName));
                this.include(this.mixins[normalizedName] || {});
              }
            });
          }
          return classes[normalizedName];
        },
        include(...includes) {
          includes.forEach((current) => {
            if (typeof current == "string") {
              if (!this.mixins[current])
                throw new Error(`Named include '${current}' does not exist.`);
              if (!this.includes.includes(current))
                this.includes.push(current);
              return include.call(this, this.mixins[current]);
            }
            return include.call(this, current);
          });
          return this;
        },
        create(name, ...args) {
          return this.for(name).new(...args);
        },
        get FileImporter() {
          if (!this.registry.hasOwnProperty("_FileImporter")) {
            this.registry._FileImporter = Class.extend().include({
              meta() {
                this.include(Registry);
                this.assignProps({
                  async importFile({ extension, ...rest }) {
                    await this.create(extension).importFile({ extension, ...rest });
                  }
                });
              },
              importFile() {
              }
            });
            const that = this;
            this.registry._FileImporter.register("js", {
              async importFile({ filePath, relativeFilePathWithoutExtension }) {
                if (relativeFilePathWithoutExtension == "_file_importer")
                  return;
                const include2 = (await import(filePath)).default;
                if (!include2)
                  return;
                that.register(relativeFilePathWithoutExtension, {
                  meta() {
                    this.filePaths.push(filePath);
                    this.include(include2);
                  }
                });
              }
            });
          }
          return this.registry._FileImporter;
        },
        async importFile(...args) {
          await this.FileImporter.importFile(...args);
        }
      });
    }
  };

  // ../@blognami/util/lib/trapify.js
  var TRAP_NAMES = ["get", "deleteProperty", "ownKeys", "has", "apply", "defineProperty", "getPrototypeOf", "setPrototypeOf", "isExtensible", "preventExtensions", "getOwnPropertyDescriptor", "enumerate", "construct"];
  var trapify = (o) => new Proxy(new Proxy(o, {
    get(target, name, ...args) {
      const descriptor = getPropertyDescriptor(target, name);
      if (descriptor) {
        const { get, value } = descriptor;
        if (get)
          return get.call(trapify(target));
        return value;
      }
      if (getPropertyDescriptor(target, "__getMissing"))
        return target.__getMissing.call(trapify(target), target, name, ...args);
    },
    set(target, name, value, ...args) {
      const descriptor = getPropertyDescriptor(target, name);
      if (descriptor) {
        const { set } = descriptor;
        if (set)
          return set.call(trapify(target), value);
      }
      if (getPropertyDescriptor(target, "__setMissing"))
        return target.__setMissing.call(trapify(target), target, name, value, ...args);
      target[name] = value;
      return true;
    }
  }), TRAP_NAMES.reduce((traps, name) => {
    const methodName = `__${name}`;
    if (getPropertyDescriptor(o, methodName))
      traps[name] = (target, ...args) => target[methodName].call(trapify(target), target, ...args);
    return traps;
  }, {}));
  var getPropertyDescriptor = (o, name) => o ? Object.getOwnPropertyDescriptor(o, name) || getPropertyDescriptor(Object.getPrototypeOf(o), name) : void 0;

  // ../@blognami/util/lib/unescape_html.js
  var import_html_entities2 = __toESM(require_lib(), 1);

  // ../@blognami/util/lib/string_reader.js
  var StringReader = class {
    constructor(string) {
      this.string = (string || "").toString();
    }
    get length() {
      return this.string.length;
    }
    toString() {
      return this.string;
    }
    match(...args) {
      const out = this.string.match(...args);
      if (out) {
        this.string = this.string.substr(out[0].length);
      }
      return out;
    }
  };

  // ../@blognami/util/lib/virtual_node.js
  var CloseTag = class {
    constructor(type) {
      this.type = type;
    }
  };
  var VirtualNode = class {
    static fromString(html) {
      const out = new this();
      out.appendHtml(html);
      return out;
    }
    static deserialize(o, parent = null) {
      const { type, attributes, children } = typeof o == "string" ? JSON.parse(o) : o;
      const out = new this(parent, type, attributes);
      out.children = children.map(
        (child) => this.deserialize(child, this)
      );
      return out;
    }
    constructor(parent = null, type = "#fragment", attributes = {}) {
      this.parent = parent;
      this.type = type;
      this.attributes = attributes;
      this.children = [];
    }
    get text() {
      const out = [];
      this.traverse((node) => {
        if (node.type == "#text") {
          out.push(node.attributes.value);
        }
      });
      return out.join("");
    }
    appendNode(type, attributes = {}) {
      const out = new this.constructor(this, type, attributes);
      this.children.push(out);
      return out;
    }
    appendHtml(html) {
      if (!(html instanceof StringReader)) {
        html = new StringReader(html);
        while (html.length > 0) {
          try {
            this.appendHtml(html);
          } catch (e) {
            if (e instanceof CloseTag) {
            } else {
              throw e;
            }
          }
        }
        return this;
      }
      while (html.length > 0) {
        let matches;
        if (matches = html.match(/^[^<]+/)) {
          this.appendNode("#text", { value: (0, import_html_entities2.decode)(matches[0]) });
        } else if (matches = html.match(/^<!DOCTYPE[^>]*>/i)) {
          if (!this.parent) {
            this.appendNode("#doctype");
          }
        } else if (matches = html.match(/^<!--([\s\S]*?)-->/i)) {
          this.appendNode("#comment", { value: matches[1] });
        } else if (matches = html.match(/^<([^>\s]+)/)) {
          const type = matches[1].toLowerCase();
          const attributes = {};
          while (html.length > 0) {
            if (matches = html.match(/^\s*([\w-]+)\s*=\s*\"([^\"]*)\"/)) {
              attributes[matches[1]] = (0, import_html_entities2.decode)(matches[2]);
            } else if (matches = html.match(/^\s*([\w-]+)\s*=\s*\'([^\']*)\'/)) {
              attributes[matches[1]] = (0, import_html_entities2.decode)(matches[2]);
            } else if (matches = html.match(/^\s*([\w-]+)\s*=\s*([^\s>]+)/)) {
              attributes[matches[1]] = (0, import_html_entities2.decode)(matches[2]);
            } else if (matches = html.match(/^\s*([\w-]+)/)) {
              attributes[matches[1]] = null;
            } else {
              html.match(/^[^>]*>/);
              break;
            }
          }
          if (matches = type.match(/^\/(.*)/)) {
            if (SELF_CLOSING_TAGS.includes(matches[1]))
              continue;
            throw new CloseTag(matches[1]);
          }
          const child = this.appendNode(type, attributes);
          if (SELF_CLOSING_TAGS.includes(type)) {
          } else if (TEXT_ONLY_TAGS.includes(type) && (matches = html.match(new RegExp(`^([\\s\\S]*?)<\\/${type}[^>]*>`)))) {
            child.appendNode("#text", { value: matches[1] });
          } else if (TEXT_ONLY_TAGS.includes(type) && (matches = html.match(/^([\s\S]+)/))) {
            child.appendNode("#text", { value: matches[1] });
          } else {
            try {
              child.appendHtml(html);
            } catch (e) {
              if (e instanceof CloseTag && e.type == type) {
              } else {
                throw e;
              }
            }
          }
        } else if (matches = html.match(/^[\s\S]/)) {
          this.appendNode("#text", { value: matches[0] });
        } else {
          break;
        }
      }
    }
    traverse(fn) {
      fn.call(this, this);
      this.children.forEach((child) => child.traverse(fn));
    }
    serialize() {
      return JSON.stringify(this, ["type", "attributes", "children"]);
    }
    toString() {
      if (this.type == "#doctype")
        return "<!DOCTYPE html>";
      if (this.type == "#text") {
        if (this.parent && TEXT_ONLY_TAGS.includes(this.parent.type))
          return this.attributes.value;
        return (0, import_html_entities.encode)(this.attributes.value);
      }
      if (this.type == "#comment")
        return `<!--${(0, import_html_entities.encode)(this.attributes.value)}-->`;
      const out = [];
      if (this.type != "#fragment") {
        out.push(`<${this.type}`);
        Object.keys(this.attributes).forEach((name) => {
          const value = this.attributes[name];
          if (value) {
            out.push(` ${name}="${(0, import_html_entities.encode)(value)}"`);
          } else {
            out.push(` ${name}`);
          }
        });
        out.push(">");
      }
      this.children.forEach((child) => {
        out.push(child.toString());
      });
      if (this.type != "#fragment" && !SELF_CLOSING_TAGS.includes(this.type))
        out.push(`</${this.type}>`);
      return out.join("");
    }
  };
  var parseHtml = (html) => VirtualNode.fromString(html);

  // ../pinstripe/lib/component_event.js
  var ComponentEvent = Class.extend().include({
    meta() {
      this.assignProps({
        instanceFor(event) {
          if (!event._componentEvent) {
            event._componentEvent = ComponentEvent.new(event);
          }
          return event._componentEvent;
        }
      });
    },
    initialize(event) {
      this.event = event;
      return trapify(this);
    },
    __get(target, name) {
      const out = target.event[name];
      if (out instanceof Node)
        return ComponentEvent.Component.instanceFor(out);
      if (typeof out == "function")
        return (...args) => out.call(target.event, ...args);
      return out;
    }
  });

  // ../pinstripe/lib/component.js
  var Component = Class.extend().include({
    meta() {
      this.assignProps({ name: "Component" });
      this.include(Registry);
      this.assignProps({
        instanceFor(node) {
          if (!node._component) {
            node._component = Component.new(node, true);
            node._component = Component.create(
              node._component.attributes["data-component"] || (node._component.type == "#document" ? "pinstripe-document" : node._component.type),
              node
            );
            if (node.isConnected)
              node._component.trigger("init", { bubbles: false });
          }
          return node._component;
        },
        normalizeName(name) {
          return Inflector.instance.dasherize(name);
        }
      });
    },
    initialize(node, skipInit = false) {
      this.node = node;
      this._registeredEventListeners = [];
      this._registeredObservers = [];
      this._registeredTimers = [];
      this._registeredAbortControllers = [];
      this._virtualNodeFilters = [];
      this.addVirtualNodeFilter(function() {
        this.traverse(normalizeVirtualNode);
      });
      if (skipInit)
        return;
      const { autofocus } = this.attributes;
      if (autofocus) {
        this.setTimeout(() => this.node.focus());
      }
    },
    get type() {
      return this.node instanceof DocumentType ? "#doctype" : this.node.nodeName.toLowerCase();
    },
    get attributes() {
      const out = {};
      if (this.node.attributes) {
        for (let i = 0; i < this.node.attributes.length; i++) {
          out[this.node.attributes[i].name] = this.node.attributes[i].value;
        }
      }
      return out;
    },
    get params() {
      const out = {};
      const { attributes } = this;
      Object.keys(attributes).forEach((name) => {
        const normalizedName = name.replace(/^data-/, "").replace(/-[a-z]/g, (item) => item[1].toUpperCase());
        out[normalizedName] = attributes[name];
      });
      return out;
    },
    get text() {
      return this.node.textContent;
    },
    get html() {
      return this.node.innerHTML;
    },
    get realParent() {
      if (this.node.parentNode)
        return this.constructor.instanceFor(this.node.parentNode);
      if (this.node.host instanceof Element)
        return this.constructor.instanceFor(this.node.host);
      return null;
    },
    get parent() {
      return this._parent ? this._parent : this.realParent;
    },
    get parents() {
      const out = [];
      let current = this;
      while (current) {
        current = current.parent;
        if (current) {
          out.push(current);
        }
      }
      return out;
    },
    get parentsIncludingThis() {
      return [this, ...this.parents];
    },
    get children() {
      return [...this.node.childNodes].map(
        (node) => this.constructor.instanceFor(node)
      );
    },
    get siblings() {
      if (this.parent) {
        return this.parent.children;
      } else {
        return [this];
      }
    },
    get previousSibling() {
      if (this.node.previousSibling) {
        return this.constructor.instanceFor(this.node.previousSibling);
      } else {
        return null;
      }
    },
    get nextSibling() {
      if (this.node.nextSibling) {
        return this.constructor.instanceFor(this.node.nextSibling);
      } else {
        return null;
      }
    },
    get nextSiblings() {
      const out = [];
      let current = this;
      while (current.nextSibling) {
        current = current.nextSibling;
        out.push(current);
      }
      return out;
    },
    get previousSiblings() {
      const out = [];
      let current = this;
      while (current.previousSibling) {
        current = current.previousSibling;
        out.push(current);
      }
      return out;
    },
    get descendants() {
      const out = this.children;
      for (let i = 0; i < out.length; i++) {
        out.push(...out[i].children);
      }
      return out;
    },
    get isInput() {
      return this.is("input, textarea");
    },
    get name() {
      return this.attributes.name;
    },
    get value() {
      if (this.is('input[type="file"]')) {
        return this.node.files[0];
      }
      if (this.is('input[type="radio"]')) {
        return this.is(":checked") ? this.node.value : void 0;
      }
      if (this.is('input[type="checkbox"]')) {
        return this.is(":checked") ? true : false;
      }
      return this.node.value;
    },
    set value(value) {
      this.node.value = value;
    },
    get selectionStart() {
      return this.node.selectionStart || 0;
    },
    get selectionEnd() {
      return this.node.selectionEnd || 0;
    },
    set selectionStart(position) {
      this.node.selectionStart = position;
    },
    set selectionEnd(position) {
      this.node.selectionEnd = position;
    },
    get inputs() {
      return this.descendants.filter((descendant) => descendant.isInput);
    },
    get values() {
      const out = {};
      this.inputs.forEach((input) => {
        const value = input.value;
        if (value !== void 0) {
          out[input.name] = value;
        }
      });
      return out;
    },
    get frame() {
      return this.parents.find(({ isFrame }) => isFrame);
    },
    get document() {
      return this.find("parentsIncludingThis", ({ isDocument }) => isDocument);
    },
    get overlay() {
      return this.parents.find(({ isOverlay }) => isOverlay);
    },
    get shadow() {
      if (!this.node.shadowRoot) {
        this.node.attachShadow({ mode: "open" });
        this.shadow.observe({ add: true }, (component) => component.descendants);
        this.shadow.patch(`<slot>`);
      }
      return Component.instanceFor(this.node.shadowRoot);
    },
    focus() {
      this.node.focus();
      return this;
    },
    is(selector) {
      if (typeof selector == "function") {
        return selector.call(this, this);
      }
      try {
        return matchesSelector.call(this.node, selector);
      } catch (e) {
        return false;
      }
    },
    on(name, ...args) {
      const fn = args.pop();
      const selector = args.pop();
      const wrapperFn = (event, ...args2) => {
        const eventWrapper = ComponentEvent.instanceFor(event);
        if (selector) {
          if (eventWrapper.target.is(selector)) {
            return fn.call(eventWrapper.target, eventWrapper, ...args2);
          }
        } else {
          return fn.call(this, eventWrapper, ...args2);
        }
      };
      this.node.addEventListener(name, wrapperFn);
      this._registeredEventListeners.push([name, wrapperFn]);
      return this;
    },
    trigger(name, options = {}) {
      let event;
      const { data, bubbles = true, cancelable = true } = options;
      if (window.CustomEvent && typeof window.CustomEvent === "function") {
        event = new CustomEvent(name, { bubbles, cancelable, detail: data });
      } else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(name, bubbles, cancelable, data);
      }
      this.node.dispatchEvent(event);
      return this;
    },
    setTimeout(...args) {
      const out = setTimeout(...args);
      this._registeredTimers.push(out);
      return out;
    },
    setInterval(...args) {
      const out = setInterval(...args);
      this._registeredTimers.push(out);
      return out;
    },
    remove() {
      if (this.realParent) {
        clean.call(this);
        remove.call(this);
      }
      return this;
    },
    addClass(name) {
      this.node.classList.add(name);
      return this;
    },
    removeClass(name) {
      this.node.classList.remove(name);
      return this;
    },
    patch(arg1) {
      if (typeof arg1 == "string") {
        const html = arg1;
        cleanChildren.call(this);
        if (TEXT_ONLY_TAGS.includes(this.type)) {
          insert.call(new Component(this.node, true), { type: "#text", attributes: { value: html }, children: [] }, null, false);
        } else {
          patchChildren.call(new Component(this.node, true), createVirtualNode.call(this, html).children);
        }
        initChildren.call(this);
        return this.children;
      }
      const attributes = arg1;
      patchAttributes.call(this, attributes);
      return this;
    },
    append(html) {
      return prepend.call(this, html);
    },
    prepend(html) {
      return prepend.call(this, html, this.children[0]);
    },
    insertBefore(html) {
      return prepend.call(this.realParent, html, this);
    },
    insertAfter(html) {
      return prepend.call(this.realParent, html, this.nextSibling);
    },
    addVirtualNodeFilter(fn) {
      this._virtualNodeFilters.push(fn);
      return this;
    },
    observe(...args) {
      if (args.length == 1)
        args.unshift({ add: true, remove: true, alter: true });
      const [options, fn] = args;
      const { add = false, remove: remove2 = false, alter = false } = options;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(
          (mutation) => {
            if (mutation.type == "childList") {
              if (add)
                mutation.addedNodes.forEach((node) => fn(Component.instanceFor(node), "add"));
              if (remove2)
                mutation.removedNodes.forEach((node) => fn(Component.instanceFor(node), "remove"));
            }
            if (mutation.type == "attributes" && alter) {
              fn(Component.instanceFor(mutation.target), "alter", mutation.attributeName);
            }
            if (mutation.type == "characterData" && alter) {
              fn(Component.instanceFor(mutation.target), "alter", "value");
            }
          }
        );
      });
      observer.observe(this.node, {
        attributes: alter,
        characterData: "alter",
        childList: add || remove2,
        subtree: true
      });
      this._registeredObservers.push(observer);
      return this;
    },
    async fetch(url, options = {}) {
      const { minimumDelay = 0, ...otherOptions } = options;
      const { progressBar } = this.document;
      const frame = this.frame || this;
      const normalizedUrl = new URL(url, frame.url);
      const abortController = new AbortController();
      this._registeredAbortControllers.push(abortController);
      progressBar.start();
      let minimumDelayTimeout;
      const cleanUp = () => {
        clearTimeout(minimumDelayTimeout);
        this._registeredAbortControllers = this._registeredAbortControllers.filter((item) => item !== abortController);
        progressBar.stop();
      };
      try {
        const promises = [
          fetch(normalizedUrl, { signal: abortController.signal, ...otherOptions }),
          new Promise((resolve) => minimumDelayTimeout = setTimeout(resolve, minimumDelay))
        ];
        const [out] = await Promise.all(promises);
        cleanUp();
        return out;
      } catch (e) {
        cleanUp();
        throw e;
      }
    },
    abort() {
      while (this._registeredAbortControllers.length) {
        this._registeredAbortControllers.pop().abort();
      }
      return this;
    },
    find(...args) {
      if (args.length == 1)
        args.unshift("descendants");
      const [collection, selector] = args;
      return this[collection].find((item) => item.is(selector));
    },
    findAll(...args) {
      if (args.length == 1)
        args.unshift("descendants");
      const [collection, selector] = args;
      return this[collection].filter((item) => item.is(selector));
    }
  });
  function remove() {
    this.node.parentNode.removeChild(this.node);
  }
  var matchesSelector = (() => {
    if (typeof window == "undefined")
      return () => false;
    const node = document.documentElement;
    return node.matches || node.matchesSelector || node.msMatchesSelector || node.mozMatchesSelector || node.webkitMatchesSelector || node.oMatchesSelector;
  })();
  function cleanChildren() {
    if (this.node.shadowRoot) {
      this.shadow.children.forEach((child) => clean.call(child));
    }
    this.children.forEach((child) => clean.call(child));
  }
  function clean() {
    this.trigger("clean", { bubbles: false });
    [...this.node.childNodes].forEach((node) => node._component && clean.call(node._component));
    while (this._registeredEventListeners.length) {
      this.node.removeEventListener(...this._registeredEventListeners.pop());
    }
    while (this._registeredObservers.length) {
      this._registeredObservers.pop().disconnect();
    }
    clearTimers.call(this);
    this.abort();
    if (this._overlayChild)
      this._overlayChild.remove();
    delete this.node._component;
  }
  function clearTimers() {
    while (this._registeredTimers.length) {
      clearTimeout(this._registeredTimers.pop());
    }
  }
  function initChildren() {
    if (this.node.shadowRoot) {
      this.shadow.children.forEach((child) => initChildren.call(child));
    }
    this.children.forEach((child) => initChildren.call(child));
  }
  function prepend(html, referenceChild) {
    const out = [];
    if (TEXT_ONLY_TAGS.includes(this.type)) {
      out.push(insert.call(new Component(this.node, true), { type: "#text", attributes: { value: html }, children: [] }, referenceChild));
    } else {
      createVirtualNode.call(this, html).children.forEach((virtualChild) => {
        out.push(insert.call(new Component(this.node, true), virtualChild, referenceChild));
      });
    }
    return out;
  }
  function createVirtualNode(html) {
    const out = VirtualNode.fromString(html);
    this._virtualNodeFilters.forEach((filter) => filter.call(out, out));
    return out;
  }
  function patch(attributes, virtualChildren) {
    const isFrame = this.type == "pinstripe-frame" || this.attributes["data-component"] == "pinstripe-frame";
    const isEmptyFrame = isFrame && virtualChildren.length == 0;
    if (isEmptyFrame && attributes["data-load-on-init"] === void 0) {
      attributes["data-load-on-init"] = "true";
    }
    patchAttributes.call(this, attributes);
    if (isEmptyFrame)
      return;
    if (this.type == "template") {
      patchChildren.call(new Component(this.node.content, true), virtualChildren);
    } else {
      patchChildren.call(new Component(this.node, true), virtualChildren);
    }
  }
  function patchAttributes(attributes) {
    if (this.type == "#text" || this.type == "#comment") {
      if (this.node.textContent != attributes.value) {
        this.node.textContent = attributes.value;
      }
    } else if (this.type != "#doctype") {
      const currentAttributes = this.attributes;
      Object.keys(currentAttributes).forEach((key) => {
        if (attributes[key] === void 0) {
          Element.prototype.removeAttribute.call(this.node, key);
        }
      });
      Object.keys(attributes).forEach((key) => {
        if (!currentAttributes.hasOwnProperty(key) || currentAttributes[key] != attributes[key]) {
          this.node.setAttribute(key, attributes[key]);
          if (key == "value") {
            this.node.value = attributes[key];
          }
        }
      });
    }
  }
  function patchChildren(virtualChildren) {
    const children = [...this.node.childNodes].map(
      (node) => new Component(node, true)
    );
    for (let i = 0; i < virtualChildren.length; i++) {
      let child = children[0];
      const virtualChild = virtualChildren[i];
      if (child && child.type == virtualChild.type) {
        patch.call(children.shift(), virtualChild.attributes, virtualChild.children);
      } else if (virtualChild.type == "#doctype") {
      } else if (virtualChild.type.match(/^#(text|comment)/)) {
        insert.call(this, virtualChild, child, false);
      } else {
        while (children.length > 0 && children[0].type.match(/^#/)) {
          remove.call(children.shift());
        }
        child = children[0];
        if (child && child.type == virtualChild.type) {
          patch.call(new Component(children.shift().node, true), virtualChild.attributes, virtualChild.children);
        } else {
          insert.call(new Component(this.node, true), virtualChild, child, false);
        }
      }
    }
    while (children.length > 0) {
      remove.call(children.shift());
    }
  }
  function insert(virtualNode, referenceChild, returnComponent = true) {
    const { type, attributes, children } = virtualNode;
    let node;
    if (type == "#text") {
      node = document.createTextNode(attributes.value);
    } else if (type == "#comment") {
      node = document.createComment(attributes.value);
    } else {
      node = type == "svg" || this.node instanceof SVGElement ? document.createElementNS("http://www.w3.org/2000/svg", type) : document.createElement(type);
      Object.keys(attributes).forEach((key) => {
        node.setAttribute(key, attributes[key]);
      });
    }
    children.forEach((child) => {
      if (type == "template") {
        insert.call(new Component(node.content, true), child, null, false);
      } else {
        insert.call(new Component(node, true), child, null, false);
      }
    });
    this.node.insertBefore(
      node,
      referenceChild && referenceChild.node
    );
    if (returnComponent) {
      return Component.instanceFor(node);
    }
  }
  function normalizeVirtualNode() {
    if (!this.parent && this.children.some((child) => child.type == "html")) {
      this.children = [
        new this.constructor(this, "#doctype"),
        ...this.children.filter((child) => child.type == "html")
      ];
    }
    if (this.type == "#text") {
      this.attributes.value = this.attributes.value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }
    if (this.type == "form" && this.attributes.autocomplete === void 0) {
      this.attributes.autocomplete = "off";
    }
    if (this.parent && this.parent.type == "textarea" && this.type == "#text") {
      this.attributes.value = this.attributes.value.replace(/^\n/, "");
    }
    if (!this.attributes["data-component"]) {
      if (this.type == "a") {
        this.attributes["data-component"] = "pinstripe-anchor";
      }
      if (this.type == "body") {
        this.attributes["data-component"] = "pinstripe-body";
      }
      if (this.type == "form") {
        this.attributes["data-component"] = "pinstripe-form";
      }
      if (this.type == "script" && this.attributes.type == "pinstripe") {
        this.attributes["data-component"] = "pinstripe-script";
      }
    }
  }
  ComponentEvent.Component = Component;

  // ../pinstripe/lib/initialize.js
  if (typeof window != "undefined") {
    const [styleEl] = Component.new(document.head, true).prepend(`<style>body { display: none; }</style>`);
    window.addEventListener("DOMContentLoaded", () => {
      const documentComponent = Component.instanceFor(document);
      documentComponent.observe({ add: true }, (component) => component.descendants);
      documentComponent.patch(document.documentElement.outerHTML);
      styleEl.remove();
    });
  }

  // ../pinstripe/lib/internal.js
  var import_meta = {};
  var path = import_meta.url;

  // lib/defer.js
  var defer = (fn, path2 = []) => new Proxy(() => {
  }, {
    get(target, name) {
      if (name == "then") {
        const out = (async () => {
          let out2 = await fn();
          let originalPath = [...path2];
          while (path2.length) {
            if (out2 == void 0) {
              const completedPath = originalPath.slice(0, originalPath.length - path2.length);
              throw new Error(`Can't unwrap deferred object${formatPath(originalPath)} (object${formatPath(completedPath)} is undefined).`);
            }
            if (typeof path2[0] == "string" && Array.isArray(path2[1])) {
              const name2 = path2.shift();
              const args = path2.shift();
              out2 = await out2[name2].call(out2, ...args);
            } else if (typeof path2[0] == "string") {
              out2 = await out2[path2.shift()];
            } else {
              out2 = await out2(...path2.shift());
            }
          }
          return out2;
        })();
        return out.then.bind(out);
      }
      return defer(fn, [...path2, name]);
    },
    apply(target, thisArg, args) {
      return defer(fn, [...path2, args]);
    }
  });
  var formatPath = (path2) => path2.map((segment) => typeof segment == "string" ? `.${segment}` : "(...)").join("");

  // lib/import_all.js
  var import_meta2 = {};
  var { readdir, stat, exists, dirname, fileURLToPath } = defer(async () => {
    const { readdir: readdir2, stat: stat2, existsSync } = await import(`${"fs"}`);
    const { promisify } = await import(`${"util"}`);
    const { dirname: dirname2 } = await import(`${"path"}`);
    const { fileURLToPath: fileURLToPath3 } = await import(`${"url"}`);
    return {
      readdir: (...args) => promisify(readdir2)(...args),
      stat: (...args) => promisify(stat2)(...args),
      exists: existsSync,
      dirname: dirname2,
      fileURLToPath: fileURLToPath3
    };
  });
  var imported = {};
  var importQueue = [];
  var processImportQueuePromise = null;
  var importAll = (...dirPaths) => {
    if (dirPaths.length) {
      importQueue.push(...dirPaths);
    }
    if (!processImportQueuePromise) {
      processImportQueuePromise = processImportQueue().then(() => {
        processImportQueuePromise = null;
      });
    }
    return processImportQueuePromise;
  };
  var processImportQueue = async () => {
    while (importQueue.length > 0) {
      const dirPath = await normalizeDirPath(importQueue.shift());
      await importAllRecursive(dirPath, dirPath);
    }
  };
  var normalizeDirPath = async (dirPath) => {
    let out = dirPath;
    if (out.match(/^file:\/\//)) {
      out = await fileURLToPath(out);
    }
    const stats = await stat(out);
    if (!stats.isDirectory()) {
      out = await dirname(out);
    }
    return out;
  };
  var importAllRecursive = async (dirPath, currentDirPath, fileImporter = defaultFileImporter) => {
    const items = await readdir(currentDirPath);
    for (let i in items) {
      const item = items[i];
      const currentPath = `${currentDirPath}/${item}`;
      const stats = await stat(currentPath);
      if (stats.isDirectory()) {
        const fileImporterFilePath = `${currentPath}/_file_importer.js`;
        if (await exists(fileImporterFilePath)) {
          let fileImporter2 = (await import(fileImporterFilePath)).default;
          if (!fileImporter2)
            continue;
          await importAllRecursive(currentPath, currentPath, fileImporter2);
        } else {
          await importAllRecursive(dirPath, currentPath, fileImporter);
        }
      } else if (!imported[currentPath]) {
        imported[currentPath] = true;
        const filePath = currentPath;
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, "");
        const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/.]+$/, "");
        const extension = relativeFilePath.replace(/^.*\./, "");
        await fileImporter.importFile({ dirPath, filePath, relativeFilePath, relativeFilePathWithoutExtension, extension });
      }
    }
  };
  var defaultFileImporter = {
    async importFile({ filePath }) {
      if (filePath.match(/\/[^\.\/]+\.js$/)) {
        await import(filePath);
      }
    }
  };
  if (IS_SERVER)
    importAll(import_meta2.url);

  // lib/component.js
  var import_meta3 = {};
  var fileURLToPath2 = void 0;
  var Client = void 0;
  Component.include({
    meta() {
      this.FileImporter.register("js", {
        meta() {
          const { importFile } = this.prototype;
          this.include({
            async importFile(params) {
              const { filePath, relativeFilePathWithoutExtension } = params;
              if ((await import(filePath)).default) {
                Client.instance.addModule(`
                                import { Component } from ${JSON.stringify(fileURLToPath2(`${import_meta3.url}/../index.js`))};
                                import include from ${JSON.stringify(filePath)};
                                Component.register(${JSON.stringify(relativeFilePathWithoutExtension)}, include);
                            `);
              } else {
                Client.instance.addModule(`
                                import ${JSON.stringify(filePath)};
                            `);
              }
              return importFile.call(this, params);
            }
          });
        }
      });
    }
  });
  if (IS_SERVER)
    importAll(path);

  // lib/markdown.js
  var import_markdown_it = __toESM(require_markdown_it(), 1);

  // lib/html.js
  var Html = Class.extend().include({
    meta() {
      this.assignProps({
        escapeValue(value) {
          if (value === false || value === void 0 || value === null) {
            return "";
          }
          return this.new(`${value}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"));
        },
        async resolveValue(value) {
          value = await value;
          if (value instanceof this) {
            return value;
          }
          if (Array.isArray(value)) {
            const out = [];
            value = [...value];
            while (value.length) {
              out.push(await this.resolveValue(value.shift()));
            }
            return this.new(out.join(""));
          }
          if (value && typeof value.toHtml == "function") {
            return this.resolveValue(value.toHtml());
          }
          if (typeof value == "function") {
            return this.resolveValue(value());
          }
          return this.escapeValue(value);
        },
        async fromTemplate(_strings, ...interpolatedValues) {
          const out = [];
          const strings = [..._strings];
          while (strings.length || interpolatedValues.length) {
            if (strings.length) {
              out.push(strings.shift());
            }
            if (interpolatedValues.length) {
              out.push(await this.resolveValue(interpolatedValues.shift()));
            }
          }
          return this.new(out.join(""));
        },
        async fromValues(...values) {
          return this.new((await Promise.all(values)).join(""));
        },
        async render(...args) {
          if (Array.isArray(args[0]))
            return this.fromTemplate(...args);
          return this.fromValues(...args);
        }
      });
    },
    initialize(value) {
      this.value = value;
    },
    toString() {
      return this.value;
    },
    toResponseArray(status = 200, headers = {}) {
      return [status, { "content-type": "text/html", ...headers }, [this.value.trim()]];
    }
  });

  // lib/markdown.js
  var Markdown = Class.extend().include({
    meta() {
      this.assignProps({
        render(value) {
          return this.new(value).render();
        }
      });
    },
    initialize(value) {
      this.value = value;
    },
    render() {
      const html = new import_markdown_it.default().use(injectLineNumbers).render(this.value || "");
      const virtualNode = parseHtml(html);
      virtualNode.children.forEach((paragraph) => {
        if (paragraph.type != "p")
          return;
        const text = paragraph.children[0];
        if (!text || text.type != "#text")
          return;
        const { value } = text.attributes;
        const matches = value.match(/^\/([^\/\s]*)(.*)$/);
        if (!matches) {
          delete paragraph.attributes["data-line-number"];
          return;
        }
        ;
        const name = matches[1];
        const args = matches[2].trim();
        paragraph.type = "div";
        paragraph.attributes = {
          ...paragraph.attributes,
          "data-component": "pinstripe-frame",
          "data-url": `/blocks/${name}?args=${encodeURIComponent(args)}`
        };
        paragraph.children = [];
      });
      return Html.new(virtualNode.toString());
    }
  });
  var injectLineNumbers = (md) => {
    md.renderer.rules.paragraph_open = (tokens, idx, options, env, slf) => {
      if (tokens[idx].map) {
        const line = tokens[idx].map[0];
        tokens[idx].attrSet("data-line-number", `${line + 1}`);
      }
      return slf.renderToken(tokens, idx, options, env, slf);
    };
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-1.js
  Component.register("_file_importer", Component);

  // ../pinstripe/lib/components/helpers.js
  var loadCache = LruCache.new();
  function loadFrame(confirm2, target, method, url, placeholderUrl) {
    if (confirm2 && !window.confirm(confirm2)) {
      return;
    }
    let frame;
    if (target == "_overlay") {
      this.document.body.clip();
      frame = this.document.descendants.find((node) => node.is("body")).append(`<pinstripe-overlay load-on-init="false"></pinstripe-overlay>`).pop();
      frame._parent = this;
      this._overlayChild = frame;
    } else {
      frame = getFrame.call(this, target);
      if (!frame)
        return;
    }
    url = new URL(url || frame.url, this.frame.url);
    if (url.protocol != "data:" && (url.host != frame.url.host || url.port != frame.url.port)) {
      return;
    }
    if (placeholderUrl)
      placeholderUrl = new URL(placeholderUrl, this.frame.url);
    if (method.match(/POST|PUT|PATCH/i)) {
      const formData = new FormData();
      const values = this.values;
      Object.keys(values).forEach((name) => formData.append(name, values[name]));
      frame.load(url, { method, body: formData, placeholderUrl });
    } else {
      frame.load(url, { method, placeholderUrl });
    }
  }
  function getFrame(target) {
    if (target == "_self")
      return this.frame;
    if (target == "_top")
      return this.document;
    if (target.match(/^_parent/)) {
      const index = target.split(/_/).length - 1;
      return this.parents.filter((n) => n.isFrame)[index];
    }
    return this.frame.descendants.find((n) => n.isFrame && n.data.name == target);
  }

  // ../pinstripe/lib/components/pinstripe_anchor.js
  var pinstripe_anchor_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      this.on("click", (event) => {
        const { confirm: confirm2, target: target2 = "_self", method: method2 = "GET", href: href2, placeholder: placeholder2 } = this.params;
        if (new URL(href2, window.location.href).host != window.location.host)
          return;
        event.preventDefault();
        event.stopPropagation();
        loadFrame.call(this, confirm2, target2, method2, href2, placeholder2);
      });
      const { target = "_self", method = "GET", href, placeholder, preload } = this.params;
      if (method == "GET" && target != "_blank") {
        const frame = target == "_overlay" ? this.frame : getFrame.call(this, target);
        if (preload != void 0)
          this.document.preload(new URL(href, frame.url));
        if (placeholder != void 0)
          this.document.preload(new URL(placeholder, frame.url));
      }
      if (this.is("input, textarea"))
        this.on("keyup", (event) => this.trigger("click"));
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-4.js
  Component.register("pinstripe_anchor", pinstripe_anchor_default);

  // ../pinstripe/lib/components/pinstripe_body.js
  var pinstripe_body_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      this.shadow.patch(`
            <pinstripe-progress-bar></pinstripe-progress-bar>
            <slot>
            <div class="styles"></div>
        `);
    },
    get progressBar() {
      if (!this._progressBar) {
        this._progressBar = this.shadow.find("pinstripe-progress-bar");
      }
      return this._progressBar;
    },
    clip() {
      this.shadow.find(".styles").patch(`
            <style>
                :host {
                    overflow: hidden !important;
                }
            </style>
        `);
    },
    unclip() {
      this.shadow.find(".styles").patch("");
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-5.js
  Component.register("pinstripe_body", pinstripe_body_default);

  // ../pinstripe/lib/components/pinstripe_document.js
  var preloading = {};
  var pinstripe_document_default = {
    meta() {
      this.include("pinstripe-frame");
      this.prototype.assignProps({
        get meta() {
          const out = {};
          this.head.findAll("meta").forEach(({ params }) => {
            const { name, content } = params;
            if (name)
              out[name] = content;
          });
          return out;
        }
      });
    },
    initialize(...args) {
      this.constructor.for("pinstripe-frame").prototype.initialize.call(this, ...args);
      window.onpopstate = (event) => {
        this.load(event.state || window.location, { replace: true });
      };
    },
    isDocument: true,
    get head() {
      if (!this._head) {
        this._head = this.find("head");
      }
      return this._head;
    },
    get body() {
      if (!this._body) {
        this._body = this.find("body");
      }
      return this._body;
    },
    get progressBar() {
      return this.body.progressBar;
    },
    async load(url = this.url.toString(), options = {}) {
      const { replace, method = "GET" } = options;
      const previousUrl = this.url.toString();
      const normalizedUrl = new URL(url, previousUrl).toString();
      if (method == "GET" && previousUrl != normalizedUrl) {
        if (replace) {
          history.replaceState(normalizedUrl, null, normalizedUrl);
        } else {
          history.pushState(normalizedUrl, null, normalizedUrl);
          window.scrollTo(0, 0);
        }
      }
      return this.constructor.for("pinstripe-frame").prototype.load.call(this, url, options);
    },
    async preload(url) {
      if (loadCache.get(url.toString()))
        return;
      if (preloading[url.toString()])
        return;
      preloading[url.toString()] = true;
      const response = await fetch(url);
      const html = await response.text();
      loadCache.put(url.toString(), html);
      delete preloading[url.toString()];
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-6.js
  Component.register("pinstripe_document", pinstripe_document_default);

  // ../pinstripe/lib/components/pinstripe_form.js
  var pinstripe_form_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      const { confirm: confirm2, target = "_self", method = "GET", action } = this.params;
      this.on("submit", (event) => {
        event.preventDefault();
        event.stopPropagation();
        loadFrame.call(this, confirm2, target, method, action);
      });
      this._initialHash = JSON.stringify(this.values);
    },
    isForm: true,
    get hasUnsavedChanges() {
      return this.params.hasUnsavedChanges == "true" || JSON.stringify(this.values) != this._initialHash;
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-7.js
  Component.register("pinstripe_form", pinstripe_form_default);

  // ../pinstripe/lib/components/pinstripe_frame.js
  var pinstripe_frame_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      let { loadOnInit } = this.params;
      if (loadOnInit == void 0) {
        loadOnInit = this.children.length == 0;
      } else {
        loadOnInit = loadOnInit == "true";
      }
      if (loadOnInit)
        this.on("init", () => this.load());
    },
    isFrame: true,
    get url() {
      if (this._url === void 0) {
        this._url = new URL(
          this.params.url || window.location,
          this.frame ? this.frame.url : window.location
        );
      }
      return this._url;
    },
    set url(url) {
      this._url = new URL(
        url,
        this.url
      );
    },
    loading: false,
    loadWasBlocked: false,
    async load(url = this.url, options = {}) {
      if (this.loading) {
        this.loadWasBlocked = true;
        return;
      }
      ;
      this.loading = true;
      this.abort();
      const { method = "GET", placeholderUrl } = options;
      const cachedHtml = method == "GET" ? loadCache.get(url.toString()) : void 0;
      if (cachedHtml)
        this.patch(cachedHtml);
      let minimumDelay = 0;
      if (!cachedHtml && placeholderUrl) {
        const placeholderHtml = loadCache.get(placeholderUrl.toString());
        if (placeholderHtml) {
          this.patch(placeholderHtml);
          minimumDelay = 300;
        }
      }
      this.url = url;
      const response = await this.fetch(url, { minimumDelay, ...options });
      const html = await response.text();
      this.loading = false;
      if (html == cachedHtml && !this.loadWasBlocked)
        return;
      this.loadWasBlocked = false;
      if (method == "GET")
        loadCache.put(url.toString(), html);
      this.patch(html);
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-8.js
  Component.register("pinstripe_frame", pinstripe_frame_default);

  // ../pinstripe/lib/components/pinstripe_modal.js
  var pinstripe_modal_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      this.shadow.patch(`
            <style>
                .root {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    overflow: auto;
                    z-index: 40;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background-color: rgba(10, 10, 10, 0.86);
                }
                .close-button {
                    background: none;
                    position: fixed;
                    right: 2.0rem;
                    top: 2.0rem;
                    height: 3.2rem;
                    width: 3.2rem;
                    user-select: none;
                    -webkit-appearance: none;
                    border: none;
                    border-radius: 999.9rem;
                    cursor: pointer;
                    pointer-events: auto;
                    display: inline-block;
                    flex-grow: 0;
                    flex-shrink: 0;
                    font-size: 0;
                    outline: none;
                    vertical-align: top;
                }
                .close-button:before, .close-button:after {
                    background-color: white;
                    content: '';
                    display: block;
                    left: 50%;
                    position: absolute;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%) rotate(45deg);
                    transform-origin: center center;
                    box-sizing: inherit;
                }
                .close-button:before {
                    height: 0.2rem;
                    width: 50%;
                }
                .close-button:after {
                    height: 50%;
                    width: 0.2rem;
                }
                .body {
                    max-height: calc(100vh - 4.0rem);
                    max-width: calc(100vw - 16.0rem);
                    min-width: 64.0rem;
                    margin: 0 auto;
                }
            </style>
            <div class="root">
                <button class="close-button"></button>
                <div class="body"><slot></div>
            </div>
        `);
      this.shadow.on("click", ".root, .close-button", () => this.trigger("close"));
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-9.js
  Component.register("pinstripe_modal", pinstripe_modal_default);

  // ../pinstripe/lib/components/pinstripe_overlay.js
  var pinstripe_overlay_default = {
    meta() {
      this.include("pinstripe-frame");
    },
    initialize(...args) {
      this.constructor.for("pinstripe-frame").prototype.initialize.call(this, ...args);
      this.shadow.patch(`
            <style>
                .root {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 1000000;
                }
            </style>
            <div class="root">
                <slot>
            </div>
        `);
      this.on("close", (event) => {
        event.stopPropagation();
        this.setTimeout(() => this.remove());
      });
    },
    isOverlay: true,
    remove(...args) {
      if (window.getSelection().type == "Range")
        return;
      let canRemove = true;
      this.descendants.filter((n) => n.isForm).forEach(({ hasUnsavedChanges, params: { unsavedChangesConfirm } }) => {
        if (hasUnsavedChanges && unsavedChangesConfirm && !confirm(unsavedChangesConfirm)) {
          canRemove = false;
        }
      });
      if (!canRemove)
        return;
      this.constructor.parent.prototype.remove.call(this, ...args);
      delete this.parent._overlayChild;
      if (!this.document.find("pinstripe-overlay")) {
        this.document.body.unclip();
      }
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-10.js
  Component.register("pinstripe_overlay", pinstripe_overlay_default);

  // ../pinstripe/lib/components/pinstripe_progress_bar.js
  var pinstripe_progress_bar_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      this.shadow.patch(`
            <div class="progress-bar"></div>
    
            <style>
                .progress-bar {
                    position: fixed;
                    display: block;
                    top: 0;
                    left: 0;
                    height: 0.3rem;
                    width: 100%;
                    z-index: 100000;
                }
                .progress-bar > div {
                    position: fixed;
                    display: block;
                    top: 0;
                    left: 0;
                    height: 0.3rem;
                    width: 0;
                    background: #0076ff;
                    transition: width 300ms ease-out, opacity 150ms 150ms ease-in;
                    transform: translate3d(0, 0, 0);
                }
            </style>
    
            <slot>
        `);
    },
    width: 0,
    startCount: 0,
    start() {
      const progressBar = this.shadow.find(".progress-bar");
      if (this.startCount == 0) {
        this._delayTimeout = this.setTimeout(() => {
          progressBar.patch("");
          progressBar.patch("<div></div>");
          this._animationInterval = this.setInterval(() => {
            const child = progressBar.children.pop();
            if (child) {
              this.width = this.width + Math.random() / 100;
              child.node.style.width = `${10 + this.width * 90}%`;
            }
          }, 300);
        }, 300);
      }
      this.startCount++;
    },
    stop() {
      const progressBar = this.shadow.find(".progress-bar");
      this.startCount--;
      if (this.startCount == 0) {
        clearTimeout(this._delayTimeout);
        clearInterval(this._animationInterval);
        this.width = 0;
        const child = progressBar.children.pop();
        if (child) {
          child.node.style.width = "100%";
          child.node.style.opacity = 0;
        }
      }
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-11.js
  Component.register("pinstripe_progress_bar", pinstripe_progress_bar_default);

  // ../pinstripe/lib/components/pinstripe_script.js
  var pinstripe_script_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      this.setTimeout(() => new Function(this.text).call(this));
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-12.js
  Component.register("pinstripe_script", pinstripe_script_default);

  // ../pinstripe/lib/components/pinstripe_skeleton.js
  var pinstripe_skeleton_default = {
    initialize(...args) {
      this.constructor.parent.prototype.initialize.call(this, ...args);
      const { height = "auto", width = "100%", radius = "3px" } = this.params;
      this.shadow.patch(`
            <style>
                @keyframes animation {
                    from,to {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                .root {
                    display: inline-block;
                    height: ${height};
                    width: ${width};
                    border-radius: ${radius};
                    position: relative;
                    overflow: hidden;
                }

                .root::before {
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    content: "";
                    background: #fff;
                    z-index: 10;
                }
                
                .root::after {
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    content: "";
                    background: #dee2e6;
                    -webkit-animation: animation-151xhna 1500ms linear infinite;
                    animation: animation 1500ms linear infinite;
                    z-index: 11;
                }
            </style>
            <div class="root"><slot></div>
        `);
    }
  };

  // ../../../../../../../tmp/tmp-2062-BVYuqARGQVdf/module-13.js
  Component.register("pinstripe_skeleton", pinstripe_skeleton_default);
})();


//# sourceMappingURL=all.js.map