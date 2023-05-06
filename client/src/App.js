import React from "react";

function App() {
  const [data, setData] = React.useState(null);
  const [caseStudy, setCaseStudy] = React.useState(null);

  const [figmaFileName, setFigmaFileName] = React.useState("");
  const [figmaURL, setFigmaURL] = React.useState("");
  const [figmaFileImages, setFigmaFileImages] = React.useState(null);
  const [error, setError] = React.useState(null);

  // parse figmaFileData to get all the ids of the children recursively
  // but only go 3 levels deep
  const getChildrenIds = (figmaFileData) => {
    let levels = 0
    let childrenIds = [];
    const getChildren = (node) => {
      if (node.children) {
        node.children.forEach((child) => {
          childrenIds.push(child.id);
          if (levels < 2) {
            levels++
            getChildren(child);
          }
        });
      }
    };

    getChildren(figmaFileData.document);
    return childrenIds;
  };

  const handleFigmaURLInput = (e) => {
    setFigmaURL(e.target.value);
    setFigmaFileImages(null);
    setFigmaFileName("");
    // parse figmaURL to get the file id
    let fileID = e.target.value.split("/")[4];
    // handle invalid figmaURL
    if (fileID !== "" && fileID === undefined) {
      setError("Paste a valid Figma URL");
      return;
    }  else {
      setError(null);
      fetchFigma(fileID);
    }
  };

  const fetchFigma = (fileID) => {
    fetch(`/figma/file?id=${fileID}`)
      .then((res) => res.json())
      .then((data) => {
        setFigmaFileName(data.name)
        let fileIDs = getChildrenIds(data)
        fetch(`/figma/fileImages?id=${fileID}&ids=${fileIDs}`)
          .then((res) => res.json())
          .then((data) => {
            setFigmaFileImages(data.images)
          });
      });
  };

  return (
    <div className="">
      <header className=" bg-slate-100 p-4">
        Load Figma File Images
      </header>
      <section className="px-4 py-4">
        <label htmlFor="figmaFile" className="block text-sm font-medium text-gray-700">
          Figma File URL
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="figmaFile"
            id="figmaFile"
            className=" p-2 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm  border border-gray-300 rounded-md"
            placeholder="https://www.figma.com/file/..."
            value={figmaURL}
            onChange={(e) => handleFigmaURLInput(e)}
          />
        </div>
        {error && <p className="py-4 font-bold text-red-700">{error}</p>}
        {
          (figmaURL && !error) && (
            <>
              <p className="py-4 text-lg font-bold">{!figmaFileImages ? "Fetching figma file..." : ("Fetched " +  Object.keys(figmaFileImages).length + " images from " + figmaFileName + ":")}</p>
              {/* display error */}
              <div className="grid grid-cols-3 gap-4">
                {figmaFileImages && Object.keys(figmaFileImages).map((key, index) => {
                  return (
                    <img src={figmaFileImages[key]} className="border border-emerald-800" alt="" key={index} />
                  )
                })}
              </div>
            </>
          )
        }
      </section>
    </div>
  );
}

export default App;