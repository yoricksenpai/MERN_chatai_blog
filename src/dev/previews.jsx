import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import PostPage from "../pages/Post.js";
import Editor from "../components/Editor.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/PostPage">
                <PostPage/>
            </ComponentPreview>
            <ComponentPreview path="/Editor">
                <Editor/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
