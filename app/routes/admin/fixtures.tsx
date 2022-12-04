import type { FormEvent } from "react";
import { useEffect, useRef } from "react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "~/components/core/button";
import IconButton from "~/components/core/button/icon";
import { FIXTURE_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import {
  getFixtures,
  createFixture,
  deleteFixture,
} from "~/db/fixtures.server";
import { getDivisions } from "~/db/divisions.server";
import { getSeasons } from "~/db/seasons.server";
import Select from "~/components/core/select";
import { getTeams } from "~/db/teams.server";
import { z } from "zod";
import FixtureCard from "~/components/fixture/card";

type LoaderData = {
  fixtures: Awaited<ReturnType<typeof getFixtures>>;
  seasons: Awaited<ReturnType<typeof getSeasons>>;
  divisions: Awaited<ReturnType<typeof getDivisions>>;
  teams: Awaited<ReturnType<typeof getTeams>>;
};

export const loader: LoaderFunction = async () => {
  const fixtures = await getFixtures();
  const seasons = await getSeasons();
  const divisions = await getDivisions();
  const teams = await getTeams();

  return json({ fixtures, seasons, divisions, teams });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "delete":
      const deleteInput = z
        .object({
          fixtureId: z.number(),
        })
        .safeParse({
          ...values,
          ...(values?.fixtureId ? { fixtureId: Number(values.fixtureId) } : {}),
        });

      if (!deleteInput.success) {
        const errors = deleteInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const {
        data: { fixtureId },
      } = deleteInput;
      await deleteFixture({ fixtureId });

      return json({ result: "deleted" });

    case "create":
      const createInput = FIXTURE_SCHEMA.safeParse({
        ...values,
        ...(values?.homeTeamId
          ? { homeTeamId: Number(values.homeTeamId) }
          : {}),
        ...(values?.awayTeamId
          ? { awayTeamId: Number(values.awayTeamId) }
          : {}),
        ...(values?.divisionId
          ? { divisionId: Number(values.divisionId) }
          : {}),
        ...(values?.seasonId ? { seasonId: Number(values.seasonId) } : {}),
      });

      if (!createInput.success) {
        const errors = createInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const { data: fixture } = createInput;

      await createFixture({
        fixture,
        select: { id: true },
      });

      return json({ result: "created" });
    default:
      throw new Error("Unrecognised request");
  }
};

export default function Fixtures() {
  const formRef = useRef<HTMLFormElement>(null);
  const transition = useTransition();
  const submit = useSubmit();
  const { fixtures, seasons, divisions, teams } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const pendingAction =
    transition.state === "submitting" &&
    transition?.submission?.formData?.get("_action");
  const isSubmitting = !!pendingAction;
  const isSubmitted = actionData?.result;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      if (actionData?.result === "created") {
        toast.success("Successfully added fixture");
      }
      if (actionData?.result === "deleted") {
        toast.success("Successfully deleted fixture");
      }
    }
  }, [actionData?.result, isSubmitted]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const _action = (
      form.elements.namedItem("_action") as Element
    )?.getAttribute("value");
    formData.set("_action", _action || "");

    const localDate = formData.get("date");

    if (localDate && typeof localDate === "string") {
      const utcDate = new Date(localDate).toISOString();
      formData.set("date", utcDate);
    }

    submit(formData, {
      method: "post",
    });
  };

  return (
    <div className="flex flex-wrap">
      <Form
        ref={formRef}
        method="post"
        className="w-full px-2 md:w-1/2"
        onSubmit={handleSubmit}
      >
        <fieldset disabled={isSubmitting}>
          <Select
            label="Home Team"
            name="homeTeamId"
            options={teams.map((team) => ({
              label: team.name,
              value: team.id,
            }))}
          />

          <Select
            label="Away Team"
            name="awayTeamId"
            options={teams.map((team) => ({
              label: team.name,
              value: team.id,
            }))}
          />

          <Input
            required
            label="Time"
            name="date"
            type="datetime-local"
            defaultValue={actionData?.values?.date}
            error={actionData?.errors?.date}
          />

          <Select
            label="Division"
            name="divisionId"
            options={divisions.map((division) => ({
              label: division.name,
              value: division.id,
            }))}
          />

          <Select
            label="Season"
            name="seasonId"
            options={seasons.map((season) => ({
              label: season.name,
              value: season.id,
            }))}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={pendingAction === "create"}
              name="_action"
              value="create"
            >
              {pendingAction === "create" ? "Adding..." : "Add"}
            </Button>
          </div>
        </fieldset>
      </Form>

      <motion.div className="grow p-2 flex flex-col gap-2" layout>
        {fixtures?.length ? (
          fixtures.map((fixture) => (
            <AnimatePresence key={fixture.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >
                <Form method="post" className="w-full">
                  <fieldset
                    className="flex items-center justify-between"
                    disabled={isSubmitting}
                  >
                    <Input type="hidden" name="fixtureId" value={fixture.id} />
                    <IconButton
                      type="submit"
                      disabled={isSubmitting}
                      name="_action"
                      value="delete"
                      icon={<XMarkIcon className="h-6 w-6" />}
                      label={`Delete ${fixture.homeTeam.name} v ${fixture.awayTeam.name}`}
                    />
                  </fieldset>
                </Form>
              </motion.div>
              <FixtureCard
                homeTeam={fixture.homeTeam.name}
                awayTeam={fixture.awayTeam.name}
                league={fixture.division.league.name}
                division={fixture.division.name}
                start={fixture.date}
              />
            </AnimatePresence>
          ))
        ) : (
          <p>No fixtures yet...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in fixture form"
      detail={error.message}
    ></ErrorAlert>
  );
};
