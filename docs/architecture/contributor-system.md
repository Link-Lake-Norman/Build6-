# BUILD6™ Partner & Contributor System

## Purpose

The BUILD6™ Partner & Contributor System manages the people and organizations
who participate in real-world student experiences.

It does not alter the BUILD6™ curriculum or six-stage student journey.

It supports the relationship ecosystem surrounding that experience.

## Contributor Sources

Every contributor begins as either:

- INQUIRY
- INVITED

An inquiry requires BUILD6™ review.

An invited contributor may be associated with an engagement that has already
been planned.

## Contributor Roles

- Presenter / Guest Speaker
- Facilitator
- Mentor
- Employer / Industry Partner
- Workplace Tour / Career Experience Host
- Job Shadow / Internship Host
- Sponsor / Supporter
- Resource / Community Partner
- Other
- Information Request

A contributor may ultimately hold more than one role.

## Relationship Workflow

NEW
→ REVIEW
→ APPROVED
→ SCHEDULED
→ CONFIRMED
→ COMPLETED

Additional states:

- DECLINED
- INACTIVE

## Core Relationship Structure

Contributor
→ Organization
→ School / Organization
→ Cohort
→ Engagement
→ Industry / Career Pathway
→ Student Exposure
→ Completion History

## Permanent Relationship Record

Contributor identity and relationship history should survive individual
engagements.

A returning contributor should not need to be recreated each semester or
for each school.

## Engagement History

Each presentation, tour, mentorship activity, facilitation session,
career experience, sponsorship, job shadow, internship or other participation
is stored as a separate engagement associated with the contributor.

This allows BUILD6™ to maintain longitudinal relationship history.

## School / Cohort Association

Engagements may be associated with:

- BUILD6™ organization
- school
- cohort
- experience/event
- industry/career pathway

This architecture allows the same contributor relationship to support
multiple schools and cohorts over time.

## Public vs. Private Information

Public intake collects only information necessary to coordinate participation.

Administrative notes, relationship history, internal status, student/cohort
associations, research data and operational information remain private.

BUILD6™ proprietary curriculum, implementation methodology and internal
program mechanics must not be exposed through the contributor form.

## Files

Headshots, logos and other uploads should not be stored in /public or on the
local filesystem as the production storage mechanism.

Secure managed storage should be established before contributor uploads
are enabled.

## Calendar

Calendar creation occurs only after an engagement is approved and scheduling
information has been confirmed.

Calendar events should reference the engagement record rather than serving
as the authoritative relationship record.

## Ambassador

Ambassador Christian School will use the same contributor and engagement
concepts.

The Ambassador implementation must be added without deleting, replacing or
rewriting existing students, curriculum, reflections, capstones, submissions,
program data or assets.

The canonical BUILD6™ contributor model should be proven first and then mapped
carefully into the existing Ambassador database.
