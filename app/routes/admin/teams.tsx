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
  useTransition,
} from "@remix-run/react";
import Button from "~/components/core/button";
import { TEAM_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import { createTeam, getTeams } from "~/db/teams.server";
import Select from "~/components/core/select";
import { getDivisions } from "~/db/divisions.server";

type LoaderData = {
  divisions: Awaited<ReturnType<typeof getDivisions>>;
  teams: Awaited<ReturnType<typeof getTeams>>;
};

export const loader: LoaderFunction = async () => {
  const divisions = await getDivisions();
  const teams = await getTeams();

  return json({ divisions, teams });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parsedInput = TEAM_SCHEMA.safeParse({
    ...values,
    ...(values?.divisionId ? { divisionId: Number(values.divisionId) } : {}),
  });

  if (!parsedInput.success) {
    const errors = parsedInput.error.errors.reduce((acc, { path, message }) => {
      return { ...acc, [path.join(".")]: message };
    }, {});
    return json({ errors, values });
  }

  const { data } = parsedInput;
  return createTeam({
    team: data,
    select: { id: true },
  });
};

export default function Teams() {
  const formRef = useRef<HTMLFormElement>(null);
  const teamName = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const { divisions, teams } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const isSubmitting = transition.state === "submitting";
  const isSubmitted = actionData?.id;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      teamName?.current?.focus();
      toast.success("Successfully added team");
    }
  }, [isSubmitted]);

  return (
    <div className="flex flex-wrap">
      <Form ref={formRef} method="post" className="w-full px-2 md:w-1/2">
        <fieldset disabled={transition.state === "submitting"}>
          <Input
            ref={teamName}
            required
            label="Team Name"
            name="name"
            defaultValue={actionData?.values?.name}
            error={actionData?.errors?.name}
          />

          <Select
            label="Division"
            name="divisionId"
            options={divisions.map((division) => ({
              label: division.name,
              value: division.id,
            }))}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </fieldset>
      </Form>

      <motion.div className="grow p-2 flex flex-col gap-2" layout>
        {teams?.length ? (
          teams.map((team) => (
            <AnimatePresence key={team.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >
                {team.name}
              </motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p>No teams yet...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in team form"
      detail={error.message}
    ></ErrorAlert>
  );
};
