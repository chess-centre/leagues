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
import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "~/components/core/button";
import IconButton from "~/components/core/button/icon";
import { DIVISION_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import {
  createDivision,
  deleteDivision,
  getDivisions,
} from "~/db/divisions.server";
import { getLeagues } from "~/db/leagues.server";
import Select from "~/components/core/select";
import { z } from "zod";

type LoaderData = {
  divisions: Awaited<ReturnType<typeof getDivisions>>;
  leagues: Awaited<ReturnType<typeof getLeagues>>;
};

export const loader: LoaderFunction = async () => {
  const divisions = await getDivisions();
  const leagues = await getLeagues();

  return json({ divisions, leagues });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "delete":
      const deleteInput = z
        .object({
          divisionId: z.number(),
        })
        .safeParse({
          ...values,
          ...(values?.divisionId
            ? { divisionId: Number(values.divisionId) }
            : {}),
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
        data: { divisionId },
      } = deleteInput;
      await deleteDivision({ divisionId });

      return json({ result: "deleted" });

    case "create":
      const parsedInput = DIVISION_SCHEMA.safeParse({
        ...values,
        ...(values?.leagueId ? { leagueId: Number(values.leagueId) } : {}),
      });

      if (!parsedInput.success) {
        const errors = parsedInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const { data } = parsedInput;

      await createDivision({
        division: data,
        select: { id: true },
      });

      return json({ result: "created" });
    default:
      throw new Error("Unrecognised request");
  }
};

export default function Divisions() {
  const formRef = useRef<HTMLFormElement>(null);
  const divisionName = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const { divisions, leagues } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const pendingAction =
    transition.state === "submitting" &&
    transition?.submission?.formData?.get("_action");
  const isSubmitting = !!pendingAction;
  const isSubmitted = actionData?.result;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      divisionName?.current?.focus();
      if (actionData?.result === "created") {
        toast.success("Successfully added division");
      }
      if (actionData?.result === "deleted") {
        toast.success("Successfully deleted division");
      }
    }
  }, [actionData?.result, isSubmitted]);

  return (
    <div className="flex flex-wrap">
      <Form ref={formRef} method="post" className="w-full px-2 md:w-1/2">
        <fieldset disabled={transition.state === "submitting"}>
          <Input
            ref={divisionName}
            required
            label="Division Name"
            name="name"
            defaultValue={actionData?.values?.name}
            error={actionData?.errors?.name}
          />

          <Select
            label="League"
            name="leagueId"
            options={leagues.map((league) => ({
              label: league.name,
              value: league.id,
            }))}
            defaultValue={actionData?.values?.leagueId}
            error={actionData?.errors?.leagueId}
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
        {divisions?.length ? (
          divisions.map((division) => (
            <AnimatePresence key={division.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >
                <Form method="post" className="w-full">
                  <fieldset
                    className="flex items-center justify-between"
                    disabled={isSubmitting}
                  >
                    <span>{division.name}</span>
                    <Input
                      type="hidden"
                      name="divisionId"
                      value={division.id}
                    />
                    <IconButton
                      type="submit"
                      disabled={isSubmitting}
                      name="_action"
                      value="delete"
                      icon={<XMarkIcon className="h-6 w-6" />}
                      label={`Delete ${division.name}`}
                    />
                  </fieldset>
                </Form>
              </motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p>No divisions yet...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in division form"
      detail={error.message}
    ></ErrorAlert>
  );
};
