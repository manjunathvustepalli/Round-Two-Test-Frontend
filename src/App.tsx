import React from "react";
import logo from "./logo.svg";

function App() {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<Boolean | null>(false);
  const [Error, setErrorMessage] = React.useState<Boolean | null>(null);
  const [csvArray, setCsvArray] = React.useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = React.useState<string[]>([]);
  const processCSV = (str: string, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const newArray: any = rows.slice(0, 50).map((row: any) => {
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

    if (files && files.length > 0) {
      setFile(files[0]);
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      const text: any = reader.result;
      processCSV(text);

      console.log(text);
    };

    reader.readAsText(files![0]);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setMessage(false);
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
      setErrorMessage(true);
      return;
    }

    setErrorMessage(false);
    setMessage(true);
  };

  return (
    <>
      {/* Main section */}
      <main className="p-10 flex flex-col  items-center space-y-4">
        {/* File upload section */}
        <section className="p-5 min-w-96  border-2 max-w-sm rounded overflow-hidden shadow-lg	justify-center content-center	items-center">
          <form
            className="flex flex-col items-center justify-evenly "
            onSubmit={onFormSubmit}
          >
            <div className="space-y-8 font-[sans-serif] max-w-md mx-auto">
              {/* File input */}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full self-center text-black text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 p-5">{error}</p>}
            {/* Upload button */}
            <button className="mx-14 my-6 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              Upload
            </button>
          </form>
        </section>

        {/* Success message */}
        {message && (
          <div
            id="toast-success"
            className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-200 dark:bg-gray-600"
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
            <div className="ms-3 text-sm font-normal">
              File Uploaded Successfully
            </div>
            {/* Close button */}
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        )}
        {Error && (
          <div
            id="toast-danger"
            className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span className="sr-only">Error icon</span>
            </div>
            <div className="ms-3 text-sm font-normal">
              File was not uploaded Successfully
            </div>
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-danger"
              aria-label="Close"
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
          </div>
        )}
      </main>

      {/* Table section */}

      {csvArray.length > 0 ? (
        <>
          <div className="mx-10	max-w-100 p-50 overflow-auto max-h-1/10 scroll-auto	shadow-md	rounded-md	">
            <p className="flex flex-col  items-center text-lg font-medium normal-case">
              Preview of the file
            </p>
            <table className="shadow-lg bg-white table-auto">
              <thead>
                <tr>
                  {/* Render table headers */}
                  {csvHeaders.map((header: any, i) => (
                    <th className="bg-blue-100 border text-left px-1 py-1">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Render table rows */}
                {csvArray.map((item: any, i) => (
                  <tr>
                    {csvHeaders.map((header: any, i) => (
                      <td className="border px-1 py-1">{item[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </>
  );
}

export default App;
