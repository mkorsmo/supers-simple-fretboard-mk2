<template>
    <div class="container mt-5">
        <!-- Add a dropdown for selecting the key -->
        <b-form-select v-model="selectedKey" class="mb-3">
            <option v-for="note in notes" :key="note">{{ note }}</option>
        </b-form-select>
        <!-- Add a button to toggle the display mode -->
        &nbsp;<b-button @click="toggleDisplayMode" class="mb-3">
            Toggle Display Mode (Current: {{ displayMode }})
        </b-button>
        <b-button @click="toggleScale" class="mb-3">
            Toggle Scale (Current: {{ scaleMode }})
        </b-button>
        <div class="row" v-for="(string, index) in guitarStrings" :key="index">
            <div class="col-1">{{ string }}</div>
            <div class="col fret-container d-flex">
                <div class="fret" v-for="fret in frets" :key="fret">
                    <!-- Use a conditional to display either the note name or the interval -->
                    <div class="fret-note" :class="[
                        displayMode === 'note'
                            ? isDiatonicNote(getNoteAtFret(string, fret))
                                ? 'diatonic'
                                : ''
                            : isDiatonicInterval(getInterval(selectedKey, getNoteAtFret(string, fret)))
                                ? 'diatonic'
                                : '',
                        getIntervalColor(getInterval(selectedKey, getNoteAtFret(string, fret)))
                    ]" v-if="displayMode === 'note'">
                        {{ getNoteAtFret(string, fret) }}
                    </div>
                    <div class="fret-note" :class="[
                        displayMode === 'interval'
                            ? isDiatonicInterval(getInterval(selectedKey, getNoteAtFret(string, fret)))
                                ? 'diatonic'
                                : ''
                            : isDiatonicNote(getNoteAtFret(string, fret))
                                ? 'diatonic'
                                : '',
                        getIntervalColor(getInterval(selectedKey, getNoteAtFret(string, fret)))
                    ]" v-else>
                        {{ getInterval(selectedKey, getNoteAtFret(string, fret)) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            selectedKey: 'C',
            displayMode: 'note', // Options are 'note' and 'interval'
            scaleMode: 'major', // Options are 'major' and 'minor'
            notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
            guitarStrings: ['E', 'B', 'G', 'D', 'A', 'E'],
            frets: Array.from({ length: 24 }, (_, i) => i), // Array of 24 frets
        };
    },
    methods: {
        toggleDisplayMode() {
            this.displayMode = this.displayMode === 'note' ? 'interval' : 'note';
        },
        toggleScale() {
            this.scaleMode = this.scaleMode === 'major' ? 'minor' : 'major';
        },
        getNoteAtFret(string, fret) {
            const stringIndex = this.notes.indexOf(string);
            const noteIndex = (stringIndex + fret) % 12;
            return this.notes[noteIndex];
        },
        getInterval(rootNote, note) {
            const intervals = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
            const noteIndex = this.notes.indexOf(note);
            const rootIndex = this.notes.indexOf(rootNote);
            const intervalIndex = (noteIndex - rootIndex + 12) % 12;

            return intervals[intervalIndex];
        },
        isDiatonicInterval(interval) {
            const majorDiatonicIntervals = ['1', '2', '3', '4', '5', '6', '7'];
            const minorDiatonicIntervals = ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'];
            const diatonicIntervals =
                this.scaleMode === 'major' ? majorDiatonicIntervals : minorDiatonicIntervals;
            return diatonicIntervals.includes(interval);
        },
        isDiatonicNote(note) {
            const scale = this.getScale(this.selectedKey);
            return scale.includes(note);
        },
        getIntervalColor(interval) {
            if (this.scaleMode === 'major') {
                if (interval === '1') return 'blue';
                if (interval === '3') return 'green';
                if (interval === '5') return 'orange';
            } else if (this.scaleMode === 'minor') {
                if (interval === '1') return 'blue';
                if (interval === 'b3') return 'green';
                if (interval === '5') return 'orange';
            }
            return '';
        },
        getScale(rootNote) {
            const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
            const naturalMinorScaleIntervals = [2, 1, 2, 2, 1, 2, 2];
            const rootIndex = this.notes.indexOf(rootNote);
            let currentIndex = rootIndex;
            const scale = [this.notes[rootIndex]];
            const scaleIntervals =
                this.scaleMode === 'major' ? majorScaleIntervals : naturalMinorScaleIntervals;
            scaleIntervals.forEach(interval => {
                currentIndex = (currentIndex + interval) % 12;
                scale.push(this.notes[currentIndex]);
            });
            return scale;
        },
    },
};
</script>
  
<style scoped>
.fret-container {
    overflow-x: auto;
}

.fret {
    width: 40px;
    height: 40px;
    background-color: #f5f5f5;
    border-right: 1px solid #000;
    flex: 0 0 auto;
}

/* Select the second fret and make its left border triple thick */
.fret:nth-child(2) {
    border-left: 3px solid #000;
}

.fret-note {
    font-size: 0.75em;
    text-align: center;
    padding-top: 10px;
    border: none;
}

.diatonic {
    font-weight: bold;
    background-color: wheat;
}

.orange { 
    color: white;
    background-color: darkorange;
}

.blue {
    color: white;
    background-color: darkblue;
}

.green {
    color: white;
    background-color: darkgreen;
}
</style>
  