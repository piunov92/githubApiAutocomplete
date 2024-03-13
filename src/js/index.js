const container = document.querySelector('.container')
const content = container.querySelector('.content__search')
const searchField = container.querySelector('.search')
const searchAutocompletion = container.querySelector('.search__autocom')

function debounce(callback, ms) {
  let DelayId = null
  return (...args) => {
    clearTimeout(DelayId)
    DelayId = setTimeout(() => callback(args), ms)
  }
}

function search() {
  let searchStr = searchField.value
  let dataArray = []
  searchAutocompletion.innerHTML = `<ul class="search__list"></ul>`
  const ul = searchAutocompletion.firstChild
  if (searchStr) {
    request(searchStr)
      .then((data) => {
        data.items.forEach((item, i) => {
          dataArray[i] = `<li class="search__item">${item.name}</li>`
        })
        ul.innerHTML = dataArray.join('')
        const allItems = ul.querySelectorAll('.search__item')
        select(allItems, data, repoList)
      })
      .catch((err) => console.log(err))
  } else {
    ul.remove()
  }
}

function select(collection, data, callback, element = null) {
  for (item of collection) {
    item.addEventListener('click', (e) => {
      callback(e.target.textContent, data)
      searchField.value = ''
      if (element) {
        setTimeout(() => element.remove(), 600)
      }
    })
  }
}

function repoList(repoName, data) {
  const repos = document.createElement('div')
  const closeBtn = document.createElement('button')
  const wrapper = document.createElement('div')
  wrapper.className = 'content__wrapper'
  closeBtn.className = 'close-button'
  closeBtn.textContent = 'close'
  repos.className = 'content__out'
  data.items.forEach((item) => {
    if (item.name === repoName) {
      wrapper.innerHTML = `<p>Name: ${item.name}</br>
                          Owner: ${item.owner.login}</br>
                          Stars: ${item.stargazers_count}</p>`
    }
  })
  repos.appendChild(wrapper)
  repos.appendChild(closeBtn)
  content.append(repos)
}

// repoList()

searchField.addEventListener('input', debounce(search, 500))

// function showAutocompletionList(data, sfValue = null) {
//   searchAutocompletion.innerHTML = `<ul class="search__list"></ul>`
//   const ul = searchAutocompletion.firstChild
//   if (sfValue) {
//     console.log(searchField.value)
//     ul.innerHTML = data.join('')
//     // const allItems = ul.querySelectorAll('.search__item')
//     // select(allItems)
//   } else {
//     ul.remove()
//   }
// }

async function request(searchString) {
  const data = await fetch(
    `https://api.github.com/search/repositories?q=${searchString}&per_page=5`
  )
  if (data.ok) {
    return await data.json()
  } else {
    throw new Error('Error Http request ' + data.status)
  }
}

// search('Redux')
//   .then((data) => {
//     data.items.forEach((element) => {
//       console.log(element.name)
//     })
//   })
//   .catch((err) => console.log(err))
