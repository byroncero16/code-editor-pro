const HACKEREARTH_URL = process.env.HACKEREARTH_URL!;
const HACKEREARTH_CLIENT_SECRET = process.env.HACKEREARTH_CLIENT_SECRET!;
const STATUS_MAX_RETRIES = 10;
const STATUS_RETRY_DELAY = 500;
const STATUS_CODES = ["REQUEST_COMPLETED", "REQUEST_FAILED"];

const languageMap = {
  javascript: "JAVASCRIPT_NODE",
  java: "JAVA14",
  python: "PYTHON",
};

type StatusResponse = {
  requestStatus: string | undefined;
  outputUrl: string | undefined;
  compileStatus: string | undefined;
  stderr: string | undefined;
};

export async function POST(request: Request) {
  const { language, code } = await request.json();

  const statusUrl = await runCode(language, code);

  console.log({ statusUrl });

  if (!statusUrl) {
    return new Response("Unable to run the code", {
      status: 500,
    });
  }

  let status: StatusResponse | undefined;

  for (let i = 0; i < STATUS_MAX_RETRIES; i++) {
    console.log(">>>Retry:", i + 1);
    status = await new Promise<StatusResponse>((resolve) =>
      setTimeout(async () => {
        const newStatus = await getStatus(statusUrl);
        resolve(newStatus);
      }, STATUS_RETRY_DELAY)
    );
    console.log({ status });
    if (
      status &&
      status.requestStatus &&
      STATUS_CODES.includes(status.requestStatus)
    ) {
      break;
    }
    if (
      status &&
      status.requestStatus === "CODE_COMPILED" &&
      status.compileStatus &&
      status.compileStatus !== "OK"
    ) {
      break;
    }
  }

  if (
    !status ||
    !status.requestStatus ||
    (!status.compileStatus && !status.outputUrl)
  ) {
    return new Response("Unable to run the code. Timeout error.", {
      status: 500,
    });
  }

  let output = "";
  if (status.outputUrl) {
    output = await getOutput(status.outputUrl);
  }
  const compileStatus = status.compileStatus;
  const stderr = status.stderr;
  console.log({ output, compileStatus, stderr });

  return Response.json({ output, compileStatus, stderr });
}

async function runCode(language: string, code: string) {
  const response = await fetch(HACKEREARTH_URL, {
    headers: {
      "client-secret": HACKEREARTH_CLIENT_SECRET,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      lang: languageMap[language as keyof typeof languageMap],
      source: code,
    }),
  });
  const { status_update_url } = await response.json();
  return status_update_url;
}

async function getStatus(statusUrl: string): Promise<StatusResponse> {
  const resultResponse = await fetch(statusUrl, {
    headers: {
      "client-secret": HACKEREARTH_CLIENT_SECRET,
      "Content-Type": "application/json",
      cache: "no-cache",
    },
    method: "GET",
  });
  const {
    request_status: { code },
    result: {
      compile_status,
      run_status: { output, stderr },
    },
  } = await resultResponse.json();
  console.log({ code, output, compile_status });
  return {
    requestStatus: code,
    compileStatus: compile_status,
    outputUrl: output,
    stderr,
  };
}

async function getOutput(outputUrl: string) {
  const response = await fetch(outputUrl, {
    headers: {
      "client-secret": HACKEREARTH_CLIENT_SECRET,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const outputText = await response.text();
  return outputText;
}
