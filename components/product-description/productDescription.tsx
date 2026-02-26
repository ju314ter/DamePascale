import { ContentBlock, ContentChild } from "@/sanity/lib/amigurumis/calls";
import React from "react";

interface ProductDescriptionProps {
  content: ContentBlock[];
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ content }) => {
  const renderText = (textBlock: ContentChild) => {
    console.log(textBlock);

    let result: React.ReactNode = textBlock.text;
    if (typeof result === "string" && result.trim() === "") {
      return <br key={textBlock._key} />;
    }
    if (textBlock.marks.includes("strong")) {
      result = <strong key={textBlock._key}>{result}</strong>;
    }
    if (textBlock.marks.includes("em")) {
      result = <em key={textBlock._key}>{result}</em>;
    }
    // if(textBlock.marks.includes("a")){
    //   result = <a key={textBlock._key}>{result}</a>;
    // }
    return result;
  };

  const renderBlock = (block: ContentBlock): JSX.Element => {
    const { style, children, listItem } = block;

    const content = children.map((child, index) => (
      <React.Fragment key={`${child._key}-${index}`}>
        {renderText(child)}
      </React.Fragment>
    ));

    if (listItem === "bullet") {
      return <li key={block._key}>{content}</li>;
    }

    const isEmpty = children.every((child) => child.text.trim() === "");
    if (isEmpty) {
      return (
        <div
          key={block._key}
          className="empty-space"
          style={{ height: "1em" }}
        />
      );
    }

    switch (style) {
      case "normal":
        return <p key={block._key}>{content}</p>;
      case "h2":
        return <h2 key={block._key}>{content}</h2>;
      case "h3":
        return <h3 key={block._key}>{content}</h3>;
      case "h4":
        return <h4 key={block._key}>{content}</h4>;
      default:
        return <p key={block._key}>{content}</p>;
    }
  };

  const renderContent = () => {
    const result: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];

    content.forEach((block, index) => {
      if (block.listItem === "bullet") {
        currentList.push(renderBlock(block));
        if (
          index === content.length - 1 ||
          content[index + 1].listItem !== "bullet"
        ) {
          result.push(
            <ul className="list-disc p-5" key={`list-${index}`}>
              {currentList}
            </ul>
          );
          currentList = [];
        }
      } else {
        if (currentList.length > 0) {
          result.push(
            <ul className="list-disc p-5" key={`list-${index}`}>
              {currentList}
            </ul>
          );
          currentList = [];
        }
        result.push(renderBlock(block));
      }
    });

    return result;
  };

  return <div className="product-description">{renderContent()}</div>;
};

export default ProductDescription;
