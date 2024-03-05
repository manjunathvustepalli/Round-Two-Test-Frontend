import React from "react";
import logo from "./logo.svg";

function App() {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string | null>("");
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<Boolean | null>(false);
  const [csvArray, setCsvArray] = React.useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = React.useState<string[]>([]);
  const processCSV = (str: string, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const newArray: any = rows.slice(0, 20).map((row: any) => {
      const values = row.split(delim);
      const eachObject: any = {};

      for (let i = 0; i < Math.min(headers.length, values.length); i++) {
        eachObject[headers[i]] = values[i];
      }

      return eachObject;
    });

    setCsvHeaders(headers);

    setCsvArray(newArray);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileName(e.target.files![0].name);
    if (files && files.length > 0) {
      setFile(files[0]);
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      const text: any = reader.result;
      processCSV(text); // plugged in here

      console.log(text);
    };

    reader.readAsText(files![0]);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    // Check if the file is a CSV
    if (!file.name.endsWith(".csv")) {
      setError("This is not a CSV file");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    const response = await fetch("http://localhost:4545/api/csv/v1", {
      method: "POST",
      body: formdata,
    });

    if (!response.ok) {
      setError("An error occurred");
      return;
    }

    setError(null);
    setMessage(true);
  };

  return (<>
    <main className="p-20 flex flex-col  items-center space-y-4">
      <section className="p-5 min-w-96  border-2 max-w-sm rounded overflow-hidden shadow-lg	justify-center content-center	items-center">
        <form
          className="flex flex-col items-center justify-evenly "
          onSubmit={onFormSubmit}
        >
          <div className="space-y-8 font-[sans-serif] max-w-md mx-auto">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full self-center text-black text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button className="mx-14 my-24">Upload</button>
        </form>
      </section>

      {message&&<div
        id="toast-success"
        className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">File Uploaded Sucessfully</div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-success"
          aria-label="Close"
          onClick={() => setMessage(false)}
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>}
      
    </main>
    <div className="m-50 max-w-100 p-50">
    <table className="shadow-lg bg-white overflow-auto">
      
      {csvArray.length > 0 ? (
        <>
          <table className="table-auto">
            <thead>
              <tr>
                {csvHeaders.map((header: any, i) => (
                  <th className="bg-blue-100 border text-left px-2 py-5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvArray.map((item: any, i) => (
                <tr>
                  {csvHeaders.map((header: any, i) => (
                    <td className="border px-2 py-5">{item[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </table></div></>
  );
}

export default App;
