import { For } from "solid-js";
import { Box } from "./components/box";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { Button } from "./components/button";
import z from "zod";

type Person = {
  element: HTMLInputElement | undefined;
  initialName?: string;
};

export function People() {
  const [people, setPeopleRaw] = createStore<Person[]>(getInitialPeople());
  const setPeople: typeof setPeopleRaw = (...args: unknown[]) => {
    debouncedSaveNamesToLocalStorage();
    return setPeopleRaw(
      ...// WORKAROUND: TypeScript has a hard time understanding store setter args type
      // SAFETY: there is a `typeof setPeopleRaw` type definition, so params must match
      (args as [any]),
    );
  };

  function shufflePeople() {
    setPeople((p) => toShuffled(p));
  }

  let saveTimeout: number | undefined;
  const saveDebounceMs = 500;
  function debouncedSaveNamesToLocalStorage() {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = window.setTimeout(() => {
      const names = people.map((person) => person.element?.value ?? "");
      savePeopleNamesToLocalStorage(names);
      saveTimeout = undefined;
    }, saveDebounceMs);
  }

  return (
    <Box>
      <h2 class="text-2xl font-bold mb-2">People</h2>

      <div class="flex flex-col gap-4">
        <Button onclick={shufflePeople} class="self-start">
          Shuffle
        </Button>

        <PeopleList
          people={people}
          setPeople={setPeople}
          onNameChange={debouncedSaveNamesToLocalStorage}
        />
      </div>
    </Box>
  );
}

function getInitialPeople(): Person[] {
  const maybeInitialNames = loadPeopleNamesFromLocalStorage();
  const initialEmptyPerson: Person = { element: undefined };

  const initialPeople: Person[] = maybeInitialNames
    ? maybeInitialNames.map(
        (name): Person => ({
          element: undefined,
          initialName: name,
        }),
      )
    : [initialEmptyPerson];

  return initialPeople;
}

function toShuffled<T>(array: T[]): T[] {
  const shuffled = array.slice();

  for (let i = shuffled.length - 1; i > 0; i--) {
    // NOTE: use `i` instead of `i-1` to allow swapping with itself.
    // This prevents situations where a 2-item array will always swap items.
    const otherIndex = Math.floor(Math.random() * i);

    const temp = shuffled[i];
    shuffled[i] = shuffled[otherIndex];
    shuffled[otherIndex] = temp;
  }

  return shuffled;
}

function PeopleList(props: {
  people: Person[];
  setPeople: SetStoreFunction<Person[]>;
  onNameChange?: (personIndex: number) => void;
}) {
  function insertPerson(index: number) {
    props.setPeople((people) =>
      people.toSpliced(index, 0, { element: undefined }),
    );
  }
  function removePerson(index: number) {
    props.setPeople((people) => people.toSpliced(index, 1));
  }
  function focusPersonNameInput(index: number) {
    const person = props.people[index];
    if (!person) {
      return;
    }
    person.element?.focus();
  }

  return (
    <ul class="list-disc pl-6 flex flex-col gap-2">
      <For each={props.people}>
        {(person, index) => (
          <li>
            <input
              type="text"
              class="w-full rounded border-b border-gray-300 focus:border-blue-500 focus:outline-none p-1 bg-blue-100"
              ref={(element) => {
                props.setPeople(index(), "element", element);
                if (person.initialName) {
                  element.value = person.initialName;
                }
              }}
              oninput={(e) => {
                props.onNameChange?.(index());
              }}
              onkeydown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newRowIndex = index() + 1;
                  insertPerson(newRowIndex);
                  focusPersonNameInput(newRowIndex);
                } else if (
                  (e.key === "Backspace" || e.key === "Delete") &&
                  person.element?.value === "" &&
                  props.people.length > 1
                ) {
                  console.log("deleting");
                  removePerson(index());
                  focusPersonNameInput(Math.max(index() - 1, 0));
                  e.preventDefault();
                } else if (
                  e.key === "ArrowDown" &&
                  index() + 1 < props.people.length
                ) {
                  e.preventDefault();
                  focusPersonNameInput(index() + 1);
                } else if (e.key === "ArrowUp" && index() - 1 >= 0) {
                  e.preventDefault();
                  focusPersonNameInput(index() - 1);
                }
              }}
            />
          </li>
        )}
      </For>
    </ul>
  );
}

const peopleNamesLocalStorageKey = "people-names";
const peopleNamesSchema = z.array(z.string());

function loadPeopleNamesFromLocalStorage(): string[] | undefined {
  const json = localStorage.getItem(peopleNamesLocalStorageKey);
  if (!json) {
    return undefined;
  }

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (error) {
    console.warn("Failed to parse people names from localStorage", error);
    return undefined;
  }

  const parseResult = peopleNamesSchema.safeParse(data);
  if (!parseResult.success) {
    console.warn(
      "Invalid people names data in localStorage",
      parseResult.error,
    );
    return undefined;
  }

  return parseResult.data;
}
function savePeopleNamesToLocalStorage(names: string[]) {
  const json = JSON.stringify(names);
  localStorage.setItem(peopleNamesLocalStorageKey, json);
}
