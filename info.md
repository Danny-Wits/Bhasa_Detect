Brief Summary of Your SLI Website
The website will be a Spoken Language Identification Evaluation System for Hindi, English, and Dogri.
Main workflow
LOGIN
  ↓
SPEAKER PROFILE
  ↓
SELECT LANGUAGE COMBINATION
  ↓
RANDOM SENTENCE DISPLAYED
  ↓
AUTOMATIC MICROPHONE
  ↓
SPEAKER READS SENTENCE
  ↓
MFCC + Δ + Δ²
  ↓
CNN-LSTM / SLI MODEL
  ↓
PREDICT LANGUAGE
  ↓
COMPARE WITH EXPECTED LANGUAGE
  ↓
✓ CORRECT / ✗ INCORRECT
  ↓
SAVE RESULTS & DELETE AUDIO
  ↓
NEXT SENTENCE
  ↓
FINAL REPORT
Main functionalities
    • Login and speaker profile 
    • Select combinations: 
        ◦ Hindi + English 
        ◦ Hindi + Dogri 
        ◦ English + Dogri 
        ◦ Hindi + English + Dogri 
    • Display predefined sentences for the target language. 
    • No Record button — microphone starts automatically after permission. 
    • Detect speech using Voice Activity Detection (VAD). 
    • Extract MFCC, Delta and Delta-Delta features. 
    • Predict Hindi / English / Dogri / Other. 
    • Automatically determine Correct/Incorrect because the expected language is already known. 
    • Store speaker details, prediction, confidence, duration, accuracy and language switches. 
    • Do not permanently store voice recordings. 
    • Generate an individual PDF/Excel report for every speaker/session. 
    • Researcher/Admin dashboard for viewing overall results. 
Final objective
The website should be very simple for the speaker:
Select combination → Read the displayed sentence → System automatically detects language → Result appears → Next sentence → Final report.
While the backend handles all the research calculations automatically.
Expected language + Predicted language + Confidence + Correct/Incorrect + Duration + Sentence ID + Language transition + Processing time.
Then the dashboard can show:
    • Overall accuracy per speaker 
    • Accuracy per language 
    • Accuracy per language combination 
    • Number of language switches 
    • Average speaking duration 
    • Average model confidence 
    • Correct vs. incorrect predictions 
    • Session-to-session performance
    •  Total speaking time 
    • Average utterance duration 
    • Minimum duration 
    • Maximum duration 
    • Duration by language 
    • Duration of correct predictions 
    • Duration of incorrect predictions
    • Speech duration 
    • Silence duration 
    • Speech-to-silence ratio 
    • Number of pauses 
    • Average pause duration
    • Language combination analysis
SLI EVALUATION REPORT
1. Speaker Information
Speaker ID 
Name 
Age 
Gender 
Place 
Date of evaluation 
Languages selected for the test
 2. Session Information
Session ID
Language Combination
Total Sentences
Session Duration
Total Speaking Duration
Average Utterance Duration
Date
 3. Language Combination
 4. Overall Performance
Overall accuracy 
Correct predictions 
Incorrect predictions 
Precision 
Recall 
F1-score 
Macro F1 
Weighted F1 
Error rate
5. Language-wise Performance
6. Confusion Matrix
7. Other Language Analysis
Number of Other predictions 
Percentage of Other predictions 
Actual Other → predicted target language 
Target language → predicted Other 
Confidence of Other predictions
8. Confidence Analysis
Predicted Language Confidence
Correct vs Incorrect Confidence
9. Language Switching Analysis
Total language switches 
Switches per minute 
Switches per sentence 
Correctly detected switches 
Missed switches 
 False switches 
 Switch detection accuracy
10. Language Transition Matrix
11. Sentence-level Results: where model fails repeatedly (on which sentences)
12. Speech Duration Analysis
Total speaking time 
Average utterance duration 
Minimum duration 
Maximum duration 
Duration by language 
Duration of correct predictions 
Duration of incorrect predictions
13. Speech Activity / Silence Analysis
If your VAD provides the information, you can calculate:
    • Speech duration 
    • Silence duration 
    • Speech-to-silence ratio 
    • Number of pauses 
    • Average pause duration

14. Processing/Latency Analysis
Audio processing time
 Feature extraction time
 Model inference time 
Total prediction time
15. Real-time Detection Performance
    • Detection latency 
    • Prediction latency 
    • Time between speech ending and result appearing 
    • Percentage of trials successfully processed 
    • Failed recognition attempts 
    • Microphone errors

16. Error Analysis
Add a dedicated section:
Why did the model make errors?
Possible categories:
    • Hindi → Dogri confusion 
    • Dogri → Hindi confusion 
    • English → Other 
    • Other → Hindi 
    • Low confidence 
    • Very short speech 
    • Long pause 
    • Background noise 
    • Pronunciation variation 
    • Code-switching
        17. Speaker-wise Analysis: For multiple participants:
    • Mean accuracy 
    • Standard deviation 
    • Minimum accuracy 
    • Maximum accuracy
15. Overall Conclusion
And graphs for:
    • Language-wise accuracy 
    • Confusion matrix 
    • Language distribution 
    • Confidence distribution 
    • Speaking duration 
    • Language switching Graph
    • Language Transition Matrix
    • Accuracy by Language Combination
    • Participant-wise performance
    • Precision/Recall/F1 by Language
    • Correct vs Incorrect Predictions
For the admin dashboard, additionally have:
    • Accuracy across speakers 
    • Accuracy across sessions 
    • Speech-duration distribution 
    • Model inference time
Your complete research system can therefore be summarized as:
Speaker → Language Combination → Random Sentence → Automatic Speech Capture → VAD → MFCC/Δ/Δ² → CNN-LSTM → Hindi/English/Dogri/Other → Compare with Ground Truth → Correct/Incorrect → Save Metadata → Delete Audio → Next Sentence → Statistics → Individual Report.
