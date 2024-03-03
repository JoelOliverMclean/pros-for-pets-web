import { Editor } from "@tinymce/tinymce-react";

function TinyMCEEditor({ initialValue, value, setValue, id }) {
  return (
    <Editor
      tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
      initialValue={initialValue}
      value={value}
      onEditorChange={(newValue, editor) => setValue(newValue)}
      init={{
        selector: `#${id}`,
        skin: "oxide-dark",
        content_css: "dark",
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "charmap",
          "anchor",
          "searchreplace",
          "table",
          "preview",
          "help",
        ],
        toolbar:
          "undo redo | " +
          "bold italic | bullist numlist | " +
          "removeformat | help",
        content_style:
          "body { font-family:Montserrat,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}

export default TinyMCEEditor;
