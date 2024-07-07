import { type JishoJapaneseWord, type JishoResult } from "unofficial-jisho-api";
import { BasicTooltip } from "~/components/_primitives/ui/basic-tooltip";
import { useToast } from "~/components/_primitives/shadcn-raw/use-toast";
import { api } from "~/trpc/react";
import { formatDistance } from "date-fns";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { LoaderCircleIcon } from "lucide-react";
import { Header } from "~/components/_primitives/ui/header";
import { Chip } from "~/components/_primitives/ui/chip";
import { cn } from "~/components/_utils/cn";
import { StopPropagation } from "~/components/_utils/stop-propagation";

type JishoDefinitionsProps = {
  word: string;
  jishoResults: JishoResult[];
};

export function JishoDefinitions({
  word,
  jishoResults,
}: JishoDefinitionsProps) {
  if (!jishoResults.length) return <p>No definition found for {word}</p>;

  return (
    <StopPropagation>
      <div className="flex flex-col gap-4 overflow-y-scroll">
        <Header variant="h4">辞書の定義</Header>
        {jishoResults.map((result, i) => (
          <JishoDefinition key={`jisho-definition-${i}`} jishoResult={result} />
        ))}
      </div>
    </StopPropagation>
  );
}

type JishoDefinitionProps = { jishoResult: JishoResult };

function JishoDefinition({ jishoResult }: JishoDefinitionProps) {
  const { toast } = useToast();

  const addToSrsMutation = api.vocab.bumpSRS.useMutation({
    onSuccess: (data) => {
      if (data.type === "new") {
        toast({
          title: `${data.word} added to SRS`,
          description: `Next due ${formatDistance(data.nextDue, new Date(), { addSuffix: true })}`,
        });
      } else {
        toast({
          title: "Already in SRS",
          description: `Next due ${formatDistance(data.nextDue, new Date(), { addSuffix: true })}`,
        });
      }
    },
  });

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await addToSrsMutation.mutateAsync({ word: jishoResult.slug });
  };

  console.log("tktk jishoResult", jishoResult);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Header variant="h5">{jishoResult.slug}</Header>
          <Readings readings={jishoResult.japanese} />
        </div>
        <div className="flex items-center gap-2">
          {jishoResult.is_common ? <ChipKinda>日常</ChipKinda> : null}
          <JLPT jlpt={jishoResult.jlpt} />
          <a
            href={`https://jisho.org/search/${jishoResult.slug}`}
            target="_blank"
          >
            <ChipKinda canHover>辞</ChipKinda>
          </a>
          <Button
            variant="chip"
            size="chip"
            disabled={addToSrsMutation.isPending}
            onClick={handleButtonClick}
          >
            {addToSrsMutation.isPending ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "難"
            )}
          </Button>
        </div>
      </div>
      {jishoResult.senses.map((sense, i) => {
        if (sense.parts_of_speech.join("") === "Wikipedia definition")
          return null;

        return (
          <div key={i} className="flex flex-col items-start gap-1">
            <div className="flex flex-row items-start gap-2">
              <p className="tabular-nums">{i + 1}.</p>
              <div className="flex flex-row items-center gap-2">
                {sense.parts_of_speech.length > 0 && (
                  <span>
                    (
                    {sense.parts_of_speech.map((part, i) => {
                      return (
                        <span key={i}>
                          <BasicTooltip
                            content={getPartOfSpeechExplanation(part)}
                          >
                            {getShortPartOfSpeech(part)}
                          </BasicTooltip>
                          {i < sense.parts_of_speech.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                    )
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <p>{sense.english_definitions.join(", ")}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function jlptString(jlptArray: string[]) {
  if (jlptArray.includes("jlpt-n5")) {
    return "N5";
  }

  if (jlptArray.includes("jlpt-n4")) {
    return "N4";
  }

  if (jlptArray.includes("jlpt-n3")) {
    return "N3";
  }

  if (jlptArray.includes("jlpt-n2")) {
    return "N2";
  }

  if (jlptArray.includes("jlpt-n1")) {
    return "N1";
  }

  return null;
}
function JLPT({ jlpt }: { jlpt: string[] }) {
  const str = jlptString(jlpt);

  if (!str) {
    return null;
  }

  return <ChipKinda>{str}</ChipKinda>;
}

function ChipKinda({
  canHover,
  children,
}: {
  canHover?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-h-6 min-w-6 rounded-lg bg-chatbubble px-1 py-0.5 text-center text-sm",
        {
          "hover:bg-chatbubble/50": canHover,
        },
      )}
    >
      {children}
    </div>
  );
}

function Readings({ readings }: { readings: JishoJapaneseWord[] }) {
  const justReadings = readings.map((r) => r.reading);
  const uniqueReadings = [...new Set(justReadings)];
  const [first, ...others] = uniqueReadings;

  if (!first) {
    return <p className="opacity-50">(reading unknown)</p>;
  }

  return (
    <p>
      <span>({first}</span>
      {others.map((reading) => (
        <span key={reading} className="opacity-50">
          , {reading}
        </span>
      ))}
      <span>)</span>
    </p>
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
    case "Pronoun":
      return "代名詞";
    case "Noun which may take the genitive case particle 'no'":
      return "形式名詞";
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
