import spacy  # type: ignore
import sys
import json

try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print(f"Error loading Spacy model: {str(e)}", file=sys.stderr)
    sys.exit(1)

def analyze_emotions(text):
    try:
        doc = nlp(text)
        emotions = {"joy": 0, "sadness": 0, "anger": 0, "excitement": 0}
        total_sentences = 0
        emotion_keywords = {
    "joy": ["happy", "joyful", "pleased", "delighted", "content", "cheerful", "elated", "ecstatic", "blissful", "euphoric", "satisfied", "excited", "optimistic", "grateful", "thankful", "giddy", "jovial"],
    "sadness": ["sad", "unhappy", "sorrowful", "depressed", "downcast", "melancholy", "mournful", "grief-stricken", "heartbroken", "despondent", "lonely", "dejected", "disheartened", "blue", "glum", "weepy"],
    "anger": ["angry", "mad", "furious", "irate", "enraged", "irritated", "annoyed", "fuming", "livid", "wrathful", "exasperated", "outraged", "infuriated", "vexed", "hostile", "agitated"],
    "fear": ["fearful", "scared", "terrified", "frightened", "anxious", "nervous", "apprehensive", "uneasy", "alarmed", "panicked", "jittery", "paranoid", "shocked", "horrified", "hysterical", "timid", "worried", "spooked", "petrified"],
    "surprise": ["surprised", "astonished", "amazed", "shocked", "startled", "dumbfounded", "stunned", "dazed", "bewildered", "flabbergasted", "taken aback", "speechless", "wide-eyed", "unbelievable", "incredulous", "astonishing"],
    "disgust": ["disgusted", "repulsed", "revolted", "nauseated", "sickened", "appalled", "offended", "grossed out", "loathing", "abhorred", "contemptuous", "detestable", "horrified", "repellent", "yucky", "foul", "distasteful"],
    "trust": ["trusting", "confident", "assured", "faithful", "loyal", "reliable", "dependable", "secure", "certain", "optimistic", "reassured", "safe", "believing", "solid", "affirmed", "dependable", "loyal"],
    "anticipation": ["anticipating", "expectant", "hopeful", "eager", "excited", "curious", "impatient", "enthusiastic", "longing", "yearning", "waiting", "looking forward", "anxious anticipation", "desirous", "impatient", "upbeat"],
    "love": ["love", "affection", "fondness", "adoration", "passion", "romantic", "caring", "devotion", "tender", "adoring", "infatuation", "attachment", "desire", "sentimental", "affectionate", "heartfelt", "unconditional"],
    "pride": ["proud", "accomplished", "honored", "content", "confident", "strong", "boastful", "pleased", "self-assured", "dignified", "egotistical", "self-respecting", "exultant", "noble", "satisfied", "victorious", "lauded"],
    "guilt": ["guilty", "remorseful", "ashamed", "regretful", "contrite", "penitent", "sorry", "apologetic", "reproachful", "self-blame", "recriminatory", "compunctious", "sorrowful", "self-conscious", "embarrassed"],
    "shame": ["ashamed", "embarrassed", "humiliated", "mortified", "disgraced", "abashed", "self-conscious", "unworthy", "low", "self-loathing", "remorseful", "discomfort", "uncomfortable", "guilty", "exposed", "sensitive"],
    "envy": ["envious", "jealous", "resentful", "covetous", "grudging", "spiteful", "begrudging", "green-eyed", "jealousy", "desire", "unhappy for others", "coveting", "resentment", "grudge", "begrudge"],
    "boredom": ["bored", "indifferent", "apathetic", "uninterested", "dull", "monotonous", "weary", "uninspired", "unengaged", "listless", "unexcited", "unmotivated", "disinterested", "bland", "tired", "unenthusiastic"],
    "surprise": ["surprised", "astonished", "amazed", "shocked", "startled", "dumbfounded", "stunned", "dazed", "bewildered", "flabbergasted", "unexpected", "startling", "unexpected", "confounded"],
    "loneliness": ["lonely", "isolated", "alone", "abandoned", "forsaken", "desolate", "neglected", "solitary", "rejected", "deserted", "separated", "friendless", "alienated", "withdrawn", "excluded", "isolated"],
    "hope": ["hopeful", "optimistic", "expectant", "positive", "believing", "confident", "looking forward", "aspiring", "dreaming", "desiring", "wishful", "visionary", "idealistic", "positive outlook", "uplifted"]
}


        for sent in doc.sents:
            total_sentences += 1
            detected_emotion = False
            for emotion, keywords in emotion_keywords.items():
                if any(keyword in sent.text.lower() for keyword in keywords):
                    emotions[emotion] += 1
                    detected_emotion = True
                    break

        # Calculate the ratio of each emotion based on the total number of sentences
        emotion_ratios = {}
        if total_sentences > 0:
            for emotion, count in emotions.items():
                emotion_ratios[emotion] = count / total_sentences
        else:
            emotion_ratios = {emotion: 0 for emotion in emotions}

        return emotion_ratios

    except Exception as e:
        print(f"Error in emotion analysis: {str(e)}", file=sys.stderr)
        return {}

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("No input text provided")
        input_text = sys.argv[1]
        result = analyze_emotions(input_text)
        try:
            output = json.dumps({"emotion_ratios": result})
            print(output)
        except Exception as json_error:
            print(f"Error during JSON serialization: {str(json_error)}", file=sys.stderr)
            sys.exit(1)
    except ValueError as ve:
        print(f"ValueError: {str(ve)}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during script execution: {str(e)}", file=sys.stderr)
        sys.exit(1)
