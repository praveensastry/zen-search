# zen-search

A simple CLI application to search for patterns in file streams.

## Setup & Usage

```bash
# In the Project root
yarn
yarn build
yarn start # will start the interactive mode

# To search in stdin stream
# -f field is the search field
# -q query is a regex pattern query
# cat data/organizations.json | yarn start -m stream -f _id -q 101
```

Note: This utility will search for related files in all files in the `interactive` mode.

## Test

```sh
yarn test
```

## Notes

1. Used Futures(from `fluture` library), instead of standard promises, for lazy evaluation of async tasks. Promises are eagerly evaluated.
2. In both modes (interactive / stream) actual search is done using streams of individual objects to account for large files. Ideally search is done through indexing and not by linear scanning.
3. Ideally multiple background workers(or distributed machines), as soon as search payload is available on the read stream(read queues).
4. Search is limited to top level fileds in the payload. It can be extended to nested fields but it would increase the implementation complexity(for example, validating payload for circular links)
5. Data directory, Input stream & Output Stream are harcoded to `data` directory, `process.input` & `process.out` respectively. Ideally these should be configurable.
6. Relationships between the files and fileds in the file are hardcoded and using this static relationship map, related search results are populated in interactive mode.
