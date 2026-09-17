TECHNICAL SPECIFICATIONS:
    1. Spectral
    a. Spectrogram
    b. Centroid
    c. Bandwidth
    d. Roll off
    e. Contrast
    f. Flux
    2. Prosodic
    a. Pitch/F0
    b. Intonation
    c. Rhythm
    d. Stress
    e. Speech Rate
    f. Duration
    g. Pauses
    3. Formants/Articulatory
    a. F1
    b. F2
    c. F3
    d. F4
    4. Time domain
    a. RMS Energy
    b. ZCR
    c. Amplitude
    d. Energy
    5. Voice quality
    a. Jitter
    b. Shimmer
    c. HNR
    d. CPP






1. Spectral Features
Feature
Formula / Definition
Python function
Spectrogram

scipy.signal.stft() or librosa.stft()
Spectral Centroid

librosa.feature.spectral_centroid(y=y, sr=sr)
Spectral Bandwidth

librosa.feature.spectral_bandwidth(y=y, sr=sr)
Spectral Roll-off
Frequency below which a specified percentage (usually 85%) of spectral energy lies
librosa.feature.spectral_rolloff(y=y, sr=sr, roll_percent=0.85)
Spectral Contrast
Difference between spectral peaks and valleys in frequency sub-bands
librosa.feature.spectral_contrast(y=y, sr=sr)
Spectral Flux
(common definition)
scipy/NumPy implementation; no direct standard librosa.feature function

2. Prosodic Features
Feature
Formula / Definition
Python function / Method
Pitch / F0
Fundamental frequency , where is pitch period
librosa.yin() / librosa.pyin()
Intonation
Temporal variation of : or slope/change of F0
Calculate from librosa.pyin()
Rhythm
Often characterized using durations of speech/silence or syllabic timing
VAD + duration statistics
Stress
Related to F0, energy and duration; no single universal formula
Combine F0 + RMS + duration
Speech Rate

Syllable estimation + duration
Duration

len(y)/sr
Pauses

VAD / silence detection
    a. Pitch / F0
Using librosa:
f0, voiced_flag, voiced_prob = librosa.pyin(
    y,
    fmin=librosa.note_to_hz('C2'),
    fmax=librosa.note_to_hz('C7'),
    sr=sr
)
You can calculate:
mean_f0 = np.nanmean(f0)
std_f0 = np.nanstd(f0)
min_f0 = np.nanmin(f0)
max_f0 = np.nanmax(f0)
Intonation
A simple F0-change measure:

Python:
f0_change = np.diff(f0)
You can use:
mean_f0_change = np.nanmean(np.abs(np.diff(f0)))
calculate F0 slope using linear regression:

where represents the pitch contour slope.

Rhythm
There is no single universally accepted rhythm formula. Common measures include:
Speech-to-pause ratio

Pause ratio

These can be calculated after Voice Activity Detection (VAD).

Stress
Stress is not normally calculated from one signal parameter.
A common acoustic representation is:

where:
    • = pitch 
    • = energy 
    • = duration 
For example, normalized stress score:

where are selected weights.

Speech Rate
If you have an estimate of syllable count:

Unit:
syllables/second
If word count is used instead:

Unit:
words/second

Duration
For an audio signal:

where:
    • = number of samples 
    • = sampling frequency 
Python:
duration = len(y) / sr

Pauses
If VAD identifies a silence interval from to :

You can calculate:
pause_duration = pause_end - pause_start
Useful derived features:
    • number of pauses 
    • mean pause duration 
    • maximum pause duration 
    • total pause duration 
    • pause ratio 

3. Formant / Articulatory Features
Formants are resonant frequencies of the vocal tract.
Feature
Definition
Recommended function
F1
First formant frequency
Praat/Parselmouth
F2
Second formant frequency
Praat/Parselmouth
F3
Third formant frequency
Praat/Parselmouth
F4
Fourth formant frequency
Praat/Parselmouth
There is not a simple formula such as the MFCC formula for directly obtaining F1–F4. They are estimated from the spectral envelope/vocal-tract resonances.
Recommended Python library
pip install praat-parselmouth
Then:
import parselmouth

sound = parselmouth.Sound("audio.wav")

formant = sound.to_formant_burg(
    time_step=0.01,
    max_number_of_formants=5,
    maximum_formant=5500
)

f1 = formant.get_value_at_time(1, time)
f2 = formant.get_value_at_time(2, time)
f3 = formant.get_value_at_time(3, time)
f4 = formant.get_value_at_time(4, time)
    • extracting mean, standard deviation, minimum and maximum F1–F4 over each recording.


4. Time-Domain Features
A. RMS Energy
The RMS value is:

Python:
rms = librosa.feature.rms(y=y)
Mean RMS:
mean_rms = np.mean(rms)

B. Zero Crossing Rate (ZCR)

where is an indicator function.
Python:
zcr = librosa.feature.zero_crossing_rate(y)
Mean:
mean_zcr = np.mean(zcr)

C. Amplitude
For a digital speech signal:

Peak-to-peak amplitude:

Python:
amplitude_max = np.max(np.abs(y))
amplitude_rms = np.sqrt(np.mean(y**2))
amplitude_pp = np.max(y) - np.min(y)

D. Energy
Short-time energy:

Python:
energy = np.sum(y**2)
For frame-wise energy:
frame_energy = np.sum(
    librosa.util.frame(y, frame_length=2048, hop_length=512)**2,
    axis=0
)
Important distinction
RMS and energy are related but not identical:

Therefore, don't report them as exactly the same feature.

5. Voice Quality Features
A. Jitter
Jitter measures cycle-to-cycle variation in fundamental period.
A common local jitter formula is:

where is the duration of the pitch period.
Recommended tool
Praat/Parselmouth.
 local jitter (%) is a common choice.

B. Shimmer
Shimmer measures cycle-to-cycle variation in amplitude.
A common formula:

where is the amplitude of a pitch cycle.
Praat/Parselmouth can calculate:
local shimmer (%) 

C. HNR — Harmonics-to-Noise Ratio
HNR measures the ratio between periodic/harmonic energy and noise energy.

Unit:
dB
A higher HNR generally indicates a more periodic/less noisy voice signal.
Praat/Parselmouth
harmonicity = sound.to_harmonicity_cc()

hnr = harmonicity.get_mean()

D. CPP — Cepstral Peak Prominence
CPP measures the prominence of the cepstral peak corresponding to the fundamental period.
Conceptually:

where:
    • = amplitude of cepstral peak 
    • = amplitude predicted by the regression/reference line 
CPP is generally expressed in dB.
CPP is particularly useful for measuring voice periodicity/quality.
Recommended tool
For reliable CPP extraction, use Praat/VoiceSauce-compatible methods or specialized voice-analysis libraries.
