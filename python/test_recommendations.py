... shell ...

Bây giờ tôi sẽ cập nhật API route để gọi trực tiếp các file Python này:

```typescriptreact file="app/api/python-recommendations/route.ts"
[v0-no-op-code-block-prefix]import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") as "popular" | "related" | "category" | "search"
  const productId = searchParams.get("productId")
  const category = searchParams.get("category")
  const query = searchParams.get("query")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  if (!type || !["popular", "related", "category", "search"].includes(type)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid or missing type parameter",
      },
      { status: 400 },
    )
  }

  try {
    // Đường dẫn đến file Python
    const pythonScriptPath = path.join(process.cwd(), "python", "api_handler.py")

    // Chuẩn bị arguments cho Python script
    const args = ["--type", type, "--limit", limit.toString()]

    if (productId) {
      args.push("--product-id", productId)
    }
    if (category) {
      args.push("--category", category)
    }
    if (query) {
      args.push("--query", query)
    }

    // Gọi Python script
    const result = await callPythonScript(pythonScriptPath, args)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Python recommendation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

function callPythonScript(scriptPath: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [scriptPath, ...args])

    let output = ""
    let errorOutput = ""

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output)
          resolve(result)
        } catch (parseError) {
          resolve({
            success: false,
            error: `Failed to parse Python output: ${parseError}`,
          })
        }
      } else {
        resolve({
          success: false,
          error: `Python process exited with code ${code}: ${errorOutput}`,
        })
      }
    })

    pythonProcess.on("error", (error) => {
      resolve({
        success: false,
        error: `Failed to start Python process: ${error.message}`,
      })
    })

    // Set timeout 30 giây
    setTimeout(() => {
      pythonProcess.kill()
      resolve({
        success: false,
        error: "Python process timeout",
      })
    }, 30000)
  })
}
