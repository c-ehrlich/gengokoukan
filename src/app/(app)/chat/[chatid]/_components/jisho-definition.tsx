import { useState } from "react";
import { type JishoResult } from "unofficial-jisho-api";
import { BasicTooltip } from "~/components/_primitives/ui/basic-tooltip";

type JishoDefinitionsProps = {
  word: string;
  jishoResults: JishoResult[];
};

export function JishoDefinitions({
  word,
  jishoResults,
}: JishoDefinitionsProps) {
  const [selectedResult, setSelectedResult] = useState(0);
  if (!jishoResults.length) return <p>No definition found for {word}</p>;
  return (
    <div className="overflow-y-scroll">
      {jishoResults.map((result, i) => (
        <JishoDefinition key={`jisho-definition-${i}`} jishoResult={result} />
      ))}
    </div>
  );
}

type JishoDefinitionProps = { jishoResult: JishoResult };

function JishoDefinition({ jishoResult }: JishoDefinitionProps) {
  return (
    <div>
      <p>{jishoResult.slug}</p>
      <div className="flex flex-col">
        {jishoResult.senses.map((sense, i) => {
          if (sense.parts_of_speech.join("") === "Wikipedia definition")
            return null;

          return (
            <div key={i}>
              <p>{sense.english_definitions.join(", ")}</p>
              <p>
                {sense.parts_of_speech.map((part, i) => {
                  const isLast = i === sense.parts_of_speech.length - 1;

                  return (
                    <span key={i}>
                      <BasicTooltip content={getPartOfSpeechExplanation(part)}>
                        <span>{getShortPartOfSpeech(part)}</span>
                      </BasicTooltip>
                      {isLast ? "" : <span>, </span>}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getShortPartOfSpeech(partOfSpeech: string): React.ReactNode {
  switch (partOfSpeech) {
    case "Noun":
      return "名詞";
    case "Suru verb":
    case "Suru verb - included":
      return "する動詞";
    case "Adverb (fukushi)":
      return "副詞";
    case "Na-adjective (keiyodoshi)":
      return "形容動詞";
    case "Expressions (phrases, clauses, etc.)":
      return "表現・慣用句";
    case "Intransitive verb":
      return "自動詞";
    // new from here
    case "Transitive verb":
      return "他動詞";
    case "Ichidan verb":
      return "一段動詞";
    case "Godan verb with 'mu' ending":
    case "Godan verb with 'nu' ending":
    case "Godan verb with 'bu' ending":
    case "Godan verb with 'gu' ending":
    case "Godan verb with 'u' ending":
    case "Godan verb with 'tsu' ending":
    case "Godan verb with 'ru' ending":
    case "Godan verb with 'ku' ending":
    case "Godan verb with 'su' ending":
      return "五段動詞";
    case "Irregular nu verb":
      return "ナ変動詞";
    case "I-adjective (keiyoushi)":
      return "形容詞";
    case "Noun or verb acting prenominally":
      return "修飾語";
    case "Pre-noun adjectival (rentaishi)":
      return "連体詞";
    case "Conjunction":
      return "接続詞";
    case "Particle":
      return "助詞";
    case "Suffix":
    case "Noun, used as a suffix":
      return "接尾語";
    case "Counter":
      return "助数詞";
    case "Place":
      return "場所";
    case "Numeric":
      return "数字";
    case "Auxiliary verb":
    case "Copula":
      return "助動詞";
    case "Yodan verb with 'su' ending (archaic)":
    case "Yodan verb with 'ku' ending (archaic)":
    case "Yodan verb with 'gu' ending (archaic)":
    case "Yodan verb with 'tsu' ending (archaic)":
    case "Yodan verb with 'nu' ending (archaic)":
    case "Yodan verb with 'bu' ending (archaic)":
    case "Yodan verb with 'mu' ending (archaic)":
    case "Yodan verb with 'ru' ending (archaic)":
      return "四段動詞";
    case "Adverb taking the 'to' particle":
      return "擬態語・擬音語";
    // new until here
    case "Wikipedia definition":
      return "wiki";
    default:
      return `TODO ABBREVIATE "${partOfSpeech}"`;
  }
}

function getPartOfSpeechExplanation(partOfSpeech: string): React.ReactNode {
  switch (partOfSpeech) {
    case "Noun":
      return "A noun, or 名詞 (meishi), is a word that represents a person, place, thing, or idea. Nouns can be the subject of a sentence, the object of a verb, or the object of a preposition.";
    case "Suru verb":
      return "A suru verb, or する動詞 (surudoushi), or サ変動詞 (sahendoushi), is a verb that ends in する (suru) and is used to make a noun into a verb. For example, 勉強 (benkyou) means 'study,' and 勉強する (benkyou suru) means 'to study.'";
    case "Adverb (fukushi)":
      return "An adverb, or 副詞 (fukushi), is not an independent class of word, as it's always used with other words. Adverbs are similar to adjectives in that they both modify words.";
    case "Na-adjective (keiyodoshi)":
      return "A na-adjective, or 形容動詞 (keiyoudoushi), is a type of adjective that behaves like a noun. Na-adjectives are used to describe things or people.";
    case "Expressions (phrases, clauses, etc.)":
      return "慣用句 (kanyouku) refers specifically to idiomatic phrases and expressions, while 表現 (hyougen) is a broader term that can include any kind of expression, including phrases, idioms, and set expressions.";
    case "Intransitive verb":
      return "自動詞 (jidoushi), or intransitive verbs, describe actions or states that do not require a direct object. the action of the verb is contained within the subject, meaning it does not directly act upon another entity.";
    case "Wikipedia definition":
      return "A Wikipedia definition is a definition that comes from Wikipedia.";
    default:
      return `TODO EXPLAIN "${partOfSpeech}"`;
  }
}

/**
 * 名詞 (meishi) - nouns
ex: 猫 (neko) - cat
動詞 (doushi) - verbs
ex: 食べる (taberu) - to eat
自動詞 (jidoushi) - intransitive verbs
ex: 泣く (naku) - to cry
他動詞 (tadoushi) - transitive verbs
ex: 読む (yomu) - to read
形容詞 (keiyoushi) - adjectives
ex: 美しい (utsukushii) - beautiful
形容動詞 (keiyoudoushi) - na-adjectives (adjectival nouns)
ex: 静か (shizuka) - quiet
副詞 (fukushi) - adverbs
ex: 早く (hayaku) - quickly
連体詞 (rentaishi) - prenominal adjectives
ex: 大きな (ookina) - big
接続詞 (setsuzokushi) - conjunctions
ex: そして (soshite) - and then
助詞 (joshi) - particles
ex: は (wa), が (ga) - subject markers
助動詞 (jodoushi) - auxiliary verbs
ex: です (desu), ます (masu) - polite forms
感動詞 (kandoushi) - interjections
ex: ああ (aa) - ah
 */