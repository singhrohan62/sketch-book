import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create Sketch Schema
const SketchSchema = Schema({
    name: { type: String, required: true },
    contents: [
        {
            userid: { type: String, required: true },
            inputs: [//the 'inputs' array will contain list of scribbles by the user
                [// Each scribble will be a list of co-ords
                    {
                        x: {
                            type: Number, required: true
                        },
                        y: {
                            type: Number, required: true
                        }
                    }
                ]
            ]
        }
    ]
})

const Sketch = mongoose.model('sketch', SketchSchema);
export default Sketch;