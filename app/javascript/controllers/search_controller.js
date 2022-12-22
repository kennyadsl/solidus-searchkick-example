import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "keywords", "results" ]
  static values = { url: String }

  disconnect() {
    this.reset()
  }

  fetchResults() {
    if(this.keywords == "") {
      this.reset()
      return
    }

    if(this.keywords == this.previousKeywords) {
      return
    }
    this.previousKeywords = this.keywords

    const url = new URL(this.urlValue)
    url.searchParams.append("keywords", this.keywords)

    this.abortPreviousFetchRequest()

    this.abortController = new AbortController()
    fetch(url, { signal: this.abortController.signal })
      .then(response => response.text())
      .then(html => {
        this.resultsTarget.innerHTML = html
      })
      .catch(() => {})
  }

  navigateResults(event) {
    if(this.searchResultsController) {
      this.searchResultsController.navigateResults(event)
    }
  }

  // private

  reset() {
    this.resultsTarget.innerHTML = ""
    this.keywordsTarget.value = ""
    this.previousKeywords = null
  }

  abortPreviousFetchRequest() {
    if(this.abortController) {
      this.abortController.abort()
    }
  }

  get keywords() {
    return this.keywordsTarget.value
  }

  get searchResultsController() {
    return this.application.getControllerForElementAndIdentifier(this.resultsTarget.firstElementChild, "search-results")
  }
}
