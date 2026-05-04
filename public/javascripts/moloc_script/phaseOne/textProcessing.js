function processText() {
  try {
    var modelText = nodeModelText.value;
    _sourceText = modelText;
    var modelTitle = nodeModelTitle.value;
    _title += modelTitle;
    extractText();
    cleanText();
    lnScanner();
    createSentences();
    createVocabulary();
    createPhrases();
  } catch (e) {
    alert("processText " + e);
  }
}

function extractText() {
  try {
    _rawText = _sourceText;
    if (_rawText[0] == "\n" || _rawText[0] == "\r") {
      _rawText = _rawText.substr(1, _sourceText.length - 1);
    }
    if (_rawText[0] == "\n" || _rawText[0] == "\r") {
      _rawText = _rawText.substr(1, _sourceText.length - 1);
    }
    //return text;
  } catch (e) {
    alert("extractText " + e);
  }
}

// Raw text is cleaned
// \r are removed
// blanks and tabs after between full stop and new line are removed
// blanks and tabs between two new lines are removed
// apostrophes are substituted with apexes
// \n is added at the end
function cleanText() {
  try {
    var text0 = "";
    var i = 0;
    while (i < _rawText.length) {
      if (_rawText[i] != "\r") {
        if (_rawText[i] == "’") {
          text0 += "'";
        } else {
          text0 += _rawText[i];
        }
      }
      i++;
    }
    const NORMAL = 0;
    const DOT = 1;
    var text1 = "";
    var i = 0;
    var state = NORMAL;
    while (i < text0.length) {
      switch (state) {
        case NORMAL: {
          switch (text0[i]) {
            case ".": {
              state = DOT;
              text1 += text0[i];
              i++;
              break;
            }
            default: {
              text1 += text0[i];
              i++;
              break;
            }
          }
          break;
        }
        case DOT: {
          switch (text0[i]) {
            case " ":
            case "\t": {
              i++;
              break;
            }
            case "\n": {
              state = NORMAL;
              text1 += text0[i];
              i++;
              break;
            }
            default: {
              text1 += text0[i];
              i++;
              break;
            }
          }
          break;
        }
      }
    }
    var i = 0;
    var text2 = "";
    while (i < text1.length) {
      if (text1[i] != "\n") {
        text2 += text1[i];
        i++;
      } else {
        text2 += text1[i];
        i++;
        var buffer = ""
        while (i < text1.length && text1[i] != "\n" && (text1[i] == " " || text1[i] == "\t")) {
          buffer += text1[i];
          i++;
        }
        if (i < text1.length && text1[i] != "\n") {
          text2 += buffer;
        }
      }
    }
    _cleanedText = text2 + "\n";
  } catch (e) {
    alert("cleanText " + e);
  }
}

// lnScanner split string s in chunks, where a chunk can be of type
// - lineFeed		"\n"
// - horizontalTab	"\t"
// - fullStop		"."
// - colon			":"
// - semiColon		";"
// - apostrophe     "'"
// - comma          ","
// - blanks 		sequence of " "
// - alphaChars		sequence of alphabetic characters, also with a final apostrophe
// - noise			numbers & others
// Carriage returns are skipped

function lnScanner() {
  try {
    const NORMAL = 0;
    const BLANKS = 1;
    const ALPHA = 2;
    var current = 0;
    var blankCounter = 0;
    var alphaCounter = 0;
    var alphaChunk = "";
    var state = NORMAL;
    _chunks = [];
    while (current < _cleanedText.length) {
      var currentChar = _cleanedText[current];
      switch (state) {
        case NORMAL: {
          switch (currentChar) {
            case "\r": { // return carriage is skipped away
              current++;
              break;
            }
            case "\n": {
              var chunk = {
                type: "lineFeed"
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case "\t": {
              var chunk = {
                type: "horizontalTab"
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case ".": {
              var chunk = {
                type: "fullStop",
                value: "."
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case ":": {
              var chunk = {
                type: "colon",
                value: ":"
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case ";": {
              var chunk = {
                type: "semiColon",
                value: ";"
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case "'": {
              var chunk = {
                type: "apostrophe",
                value: "'"
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case ",": {
              var chunk = {
                type: "comma",
                value: ","
              }
              _chunks.push(chunk);
              current++;
              break;
            }
            case " ": {
              blankCounter = 1;
              state = BLANKS;
              current++;
              break;
            }
            default: {
              if (isAlphaChar(currentChar)) {
                alphaCounter = 1;
                alphaChunk += currentChar;
                current++;
                state = ALPHA;
              } else { // numbers & others
                var chunk = {
                  type: "noise"
                }
                _chunks.push(chunk);
                current++;
              }
            }
          }
          break;
        }
        case BLANKS: {
          if (currentChar == " ") {
            blankCounter++;
            current++;
          } else {
            var chunk = {
              type: "blanks",
              size: blankCounter
            }
            blankCounter = 0;
            _chunks.push(chunk);
            state = NORMAL;
          }
          break;
        }
        case ALPHA: {
          if (isAlphaChar(currentChar)) {
            alphaCounter++;
            alphaChunk += currentChar;
            current++;
          } else {
            if (currentChar == "'") {
              alphaCounter++;
              alphaChunk += currentChar;
              current++;
            }
            var chunk = {
              type: "alphaChars",
              size: alphaCounter,
              value: alphaChunk
            }
            alphaCounter = 0;
            alphaChunk = "";
            _chunks.push(chunk);
            state = NORMAL;
          }
          break;
        }
      }
    }
  } catch (e) {
    alert("lnScanner " + e);
  }
}

function isAlphaChar(c) {
  return 'a' <= c && c <= 'z' ||
    'A' <= c && c <= 'Z' ||
    c == 'à' ||
    c == 'è' ||
    c == 'é' ||
    c == 'ì' ||
    c == 'ò' ||
    c == 'ù';
}

//-----------------------------------------------------------------
// A sentence is a chunk made of an array of alphabetic strings, commas, and apostrophes
// beginning with an alphabetic string and terminated by a fullStop. Inside a sentence,
// all chunks which are not alphabetic strings, commas, and apostrophes are removed.
// newChunks is a list of sentence, lineFeed, comma, blanks, colon, semiColon.

// - lineFeed		"\n"
// - horizontalTab	"\t"
// - fullStop		"."
// - colon			":"
// - semiColon		";"
// - blanks 		sequence of " "
// - alphaChars		sequence of alphabetic characters
// - noise			numbers & others

function createSentences() {
  try {
    const NORMAL = 0;
    const SENTENCE = 1;
    _sentences = [];
    var sentence = [];
    var i = 0;
    var state = NORMAL;
    while (i < _chunks.length) {
      var chunk = _chunks[i];
      switch (state) {
        case NORMAL: {
          if (chunk.type == "alphaChars") {
            sentence.push(chunk.value);
            state = SENTENCE;
          } else {
            _sentences.push(chunk);
          }
          break;
        }
        case SENTENCE: { // remove noise chunks in a sentence
          if (chunk.type == "alphaChars" || chunk.type == "comma" || chunk.type == "apostrophe") {
            sentence.push(chunk.value);
          } else if (chunk.type == "fullStop") {
            var sentenceChunk = {
              type: "sentence",
              value: sentence
            }
            _sentences.push(sentenceChunk);
            sentence = [];
            state = NORMAL;
          }
          break;
        }
      }
      i++;
    }
  } catch (e) {
    alert("createSentences " + e);
  }
}

function createVocabulary() {
  try {
    _vocabulary = {};
    for (var v in _baseVocabulary) {
      _vocabulary[v] = _baseVocabulary[v];
    }
    for (var i = 0; i < _sentences.length; i++) {
      var sentence = _sentences[i];
      if (sentence.type == "sentence") {
        if (isDefinition(sentence)) {
          var voice = extractVoice(sentence);
          var voiceId = voice.id;
          if (!(voiceId in _vocabulary)) {
            _vocabulary[voiceId] = voice;
          }
        }
      }
    }
  } catch (e) {
    alert("createVocabulary " + e);
  }
}

function isDefinition(sentence) {
  try {
    var value = sentence.value;
    var i = 0;

    // check article
    if (i == value.length) {
      return false;
    }
    if (!(value[i] in _articles)) {
      return false;
    }
    i++;

    // check name and literal is
    while (i < value.length && value[i] != _isLiteral && value[i] != _areLiteral) {
      i++;
    }
    if (i == value.length) {
      return false;
    } else {
      i++;
    }

    // check literal a
    if (i == value.length) {
      return false;
    }
    if (value[i] != _aLiteral) {
      return false;
    }
    i++;

    // skip until role or document
    while (i < value.length && value[i] != _roleLiteral && value[i] != _documentLiteral) {
      i++;
    }

    return i < value.length;
  } catch (e) {
    alert("isDefinition " + e);
  }
}

function extractVoice(sentence) {
  try {
    var value = sentence.value;
    var i = 0;

    // article
    i++;

    // name
    var pieces = [];
    pieces.push(value[i]);
    var id = value[i].toLowerCase();
    i++;
    while (value[i] != _isLiteral && value[i] != _areLiteral) {
      pieces.push(value[i]);
      var idPart = value[i].toLowerCase();
      id += idPart[0].toUpperCase() + idPart.substr(1, idPart.length - 1);
      i++;
    }
    return {
      type: "word",
      syntax: "noun",
      id: id,
      pieces: pieces
    }
  } catch (e) {
    alert("extractVoice " + e);
  }
}

function createVoice(sentence) {
  try {
    var value = sentence.value;
    var i = 0;

    // article
    i++;

    // name
    var pieces = [];
    pieces.push(value[i]);
    var id = value[i].toLowerCase();
    i++;
    while (value[i] != _isLiteral && value[i] != _areLiteral) {
      pieces.push(value[i]);
      var idPart = value[i].toLowerCase();
      id += idPart[0].toUpperCase() + idPart.substr(1, idPart.length - 1);
      i++;
    }

    return {
      type: "word",
      syntax: "noun",
      id: id,
      pieces: pieces
    }
  } catch (e) {
    alert("createVoice " + e);
  }
}

//-----------------------------------------------------------------
// A phrase is an array of words that can belong to a vocabulary.
// A word that does not belong to a vocabulary is added to the phrase with syntax unknown.
// In order to manage multi words (i.e. words made of more than one word) the vocabulary
// must be searched with care.

function createPhrases() {
  try {
    _phrases = [];
    for (var i = 0; i < _sentences.length; i++) {
      var sentence = _sentences[i];
      if (sentence.type == "sentence") {
        if (checkKeyword(sentence.value)) {
          var phrase = {
            type: "keyword",
            value: sentence.value[0],
            triggered: true
          }
          _phrases.push(phrase);
        } else {
          var value = createPhrase(sentence.value);
          var phrase = {
            type: "phrase",
            value: value,
            triggered: false
          }
          _phrases.push(phrase);
        }
      } else {
        _phrases.push(sentence);
      }
    }
  } catch (e) {
    alert("createPhrases " + e);
  }
}

function checkKeyword(sentence) {
  try {
    return (sentence.length == 1) &&
      (sentence[0] == "Decisione" || sentence[0] == "Ripeti" || sentence[0] == "Parallelo");
  } catch (e) {
    alert("checkKeyword " + e);
  }
}

function createPhrase(sentence) {
  try {
    var phrase = [];
    var i = 0;
    while (i < sentence.length) {
      var word = searchMaxWordInVocabulary(sentence, i);
      phrase.push(cloneWord(word));
      i += word.pieces.length;
    }
    return phrase;
  } catch (e) {
    alert("createPhrase " + e);
  }
}

function searchMaxWordInVocabulary(sentence, begin) {
  try {
    var i = 0;
    var wordSentence = [];
    var lastWordFound = {
      type: "word",
      syntax: "unknown",
      id: sentence[begin + i],
      pieces: [sentence[begin + i]]
    }
    while ((begin + i) < sentence.length) {
      wordSentence.push(sentence[begin + i]);
      var word = searchWordInVocabulary(wordSentence);
      if (word) {
        lastWordFound = word;
      }
      i++;
    }
    return lastWordFound;
  } catch (e) {
    alert("searchMaxWordInVocabulary " + e);
  }
}

function searchWordInVocabulary(sentence) {
  try {
    var voice;
    var found = false;
    for (voice in _vocabulary) {
      if (equalSentences(_vocabulary[voice].pieces, sentence)) {
        found = true;
        break;
      }
    }
    if (found) {
      return _vocabulary[voice];
    } else {
      return null;
    }
  } catch (e) {
    alert("searchWordInVocabulary " + e);
  }
}

function equalSentences(sentence1, sentence2) {
  try {
    if (sentence1.length != sentence2.length) {
      return false;
    }
    var i = 0;
    while (i < sentence1.length &&
      sentence1[i] == sentence2[i]) {
      i++;
    }
    return i == sentence1.length;
  } catch (e) {
    alert("equalSentences " + e);
  }
}

function cloneWord(word) {
  try {
    var clone = {
      type: word.type,
      syntax: word.syntax,
      id: word.id,
      pieces: word.pieces
    }
    return clone;
  } catch (e) {
    alert("cloneWord " + e);
  }
}
