import { spawn } from "child_process"
import path from "path"

export interface PythonRecommendationRequest {
  type: "popular" | "related" | "category" | "search"
  productId?: string
  category?: string
  query?: string
  limit?: number
}

export interface PythonRecommendationResponse {
  success: boolean
  data?: any[]
  error?: string
}

export async function callPythonRecommendationEngine(
  request: PythonRecommendationRequest,
): Promise<PythonRecommendationResponse> {
  return new Promise((resolve) => {
    try {
      // Đường dẫn đến file Python
      const pythonScriptPath = path.join(process.cwd(), "python", "api_handler.py")

      // Chuẩn bị arguments
      const args = ["--type", request.type]

      if (request.productId) {
        args.push("--product-id", request.productId)
      }
      if (request.category) {
        args.push("--category", request.category)
      }
      if (request.query) {
        args.push("--query", request.query)
      }
      if (request.limit) {
        args.push("--limit", request.limit.toString())
      }

      // Spawn Python process
      const pythonProcess = spawn("python3", [pythonScriptPath, ...args])

      let output = ""
      let errorOutput = ""

      // Collect output
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString()
      })

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString()
      })

      // Handle process completion
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

      // Handle process error
      pythonProcess.on("error", (error) => {
        resolve({
          success: false,
          error: `Failed to start Python process: ${error.message}`,
        })
      })

      // Set timeout
      setTimeout(() => {
        pythonProcess.kill()
        resolve({
          success: false,
          error: "Python process timeout",
        })
      }, 30000) // 30 second timeout
    } catch (error) {
      resolve({
        success: false,
        error: `Unexpected error: ${error}`,
      })
    }
  })
}

// Wrapper functions for easier use
export async function getPythonPopularProducts(limit = 10) {
  return callPythonRecommendationEngine({ type: "popular", limit })
}

export async function getPythonRelatedProducts(productId: string, limit = 4) {
  return callPythonRecommendationEngine({ type: "related", productId, limit })
}

export async function getPythonCategoryProducts(category: string, limit = 8) {
  return callPythonRecommendationEngine({ type: "category", category, limit })
}

export async function getPythonSearchProducts(query: string, limit = 20) {
  return callPythonRecommendationEngine({ type: "search", query, limit })
}
