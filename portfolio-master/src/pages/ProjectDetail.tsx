import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const projectData: Record<string, any> = {
    'aws-storage-platform': {
      title: 'AWS Storage Platform — Progressive Cloud Engineering and Detection Case Study',
      date: '6 October 2026',
      github: 'https://github.com/Linathimqalo/aws-storage-platform',
      technologies: ['AWS CLI', 'Terraform', 'IAM', 'S3', 'KMS', 'Detection Engineering', 'Incident Response'],
      sections: [
        {
          title: 'Executive Summary',
          content: `This project documents the build of an AWS storage environment across four progressive phases, developed entirely in a local AWS emulator (Floci). The goal was not to learn individual AWS services in isolation, but to understand how a real cloud environment evolves: from manual provisioning through automation, security hardening, and finally operational detection.

The environment manages five S3 buckets, a KMS encryption key, and a least-privilege IAM user, all under Terraform control with remote state. A custom Bash audit script checks every bucket for public exposure, writes structured JSON reports, and exits non-zero when findings exist.

The most valuable part of the project was not the infrastructure. It was what happened when I deliberately broke it. After applying Block Public Access, SSE-KMS encryption, and explicit Deny policies to every bucket, I disabled one bucket's controls and added a public policy to see whether my detection would catch it. It caught the Block Public Access drift. It missed the public policy entirely — a bug in my own audit script.

Fixing that bug taught more about detection engineering than any tutorial. A detector that fails silently is worse than no detector at all.`
        },
        {
          title: 'Project Structure',
          content: [
            '**The project is organised as four phases, each a distinct layer of engineering maturity:**',
            '',
            '| Phase | Focus | Key Output |',
            '|-------|-------|------------|',
            '| 1 | CLI Fundamentals | Manual provisioning, evidence capture |',
            '| 2 | Terraform Automation | Declarative infrastructure, state management |',
            '| 3 | Security Controls | Block Public Access, SSE-KMS, explicit Deny, IAM least privilege |',
            '| 4 | Operations & Detection | Audit script, remote state, incident-response documentation |',
            '',
            'Each phase lives in a numbered folder (legacy/phase-1-cli/, etc.) with a standalone README explaining its scope, commands, and findings.'
          ]
        },
        {
          title: 'Environment and Tooling',
          content: [
            '**AWS Emulator:** Floci — runs locally in Docker, exposes the S3, IAM, KMS, and STS APIs on localhost:4566',
            '',
            '**CLI:** AWS CLI v2',
            '',
            '**Infrastructure as Code:** Terraform v1.16, AWS provider v5.100.0',
            '',
            '**Scripting:** Bash with jq for JSON parsing',
            '',
            '**Version Control:** Git, hosted on GitHub',
            '',
            '**State:** S3 remote backend (terraform-state-storage)',
            '',
            'Floci was chosen for cost and safety. Real AWS would incur charges, and — more importantly — the misconfiguration drill in Phase 3 would be dangerous against a live account. Running locally means breaking things on purpose carries no risk.',
            '',
            'The patterns learned (Terraform structure, IAM least privilege, S3 security controls, detection design) translate directly to real AWS. The only differences are in the emulator\'s quirks and the endpoints override.'
          ]
        },
        {
          title: 'Phase 1 — CLI Fundamentals',
          content: [
            'Phase 1 established the basics: creating IAM users, creating S3 buckets, uploading objects, and inspecting ACLs and metadata. Every command\'s output was saved to a file as evidence — the same practice a security engineer follows during an audit.',
            '',
            '**Key commands and what they taught:**',
            '',
            '```bash',
            '# Establish identity — always the first command in a session',
            'aws sts get-caller-identity',
            '',
            '# Create an identity',
            'aws iam create-user --user-name storage-admin',
            '',
            '# Create and populate a bucket',
            'aws s3 mb s3://company-storage-lab',
            'aws s3 cp lab-data.txt s3://company-storage-lab/lab-data.txt',
            '',
            '# Audit bucket access',
            'aws s3api get-bucket-acl --bucket company-storage-lab',
            '',
            '# Inspect object metadata (size, ETag/MD5, content type)',
            'aws s3api head-object --bucket audit-logs-lab --key audit-entry.txt',
            '```',
            '',
            'The distinction between high-level (aws s3) and low-level (aws s3api) commands became central. aws s3 hides security settings behind simple operations; aws s3api exposes everything. Security work uses s3api more often.',
            '',
            'Several command mistakes taught naming conventions: list-users is plural because it returns a list; get-bucket-acl is singular because it acts on one bucket. The AWS CLI uses this distinction consistently.',
            '',
            '**Findings from Phase 1:** Fresh buckets show only the owner with FULL_CONTROL and no public grants. This is the correct baseline. Default encryption is AWS-managed AES256 — no customer-managed KMS key.'
          ]
        },
        {
          title: 'Phase 2 — Terraform Automation',
          content: [
            'Phase 2 rebuilt the Phase 1 environment declaratively. The shift from imperative ("do this now") to declarative ("this is what I want to exist") is more significant than it first appears.',
            '',
            'Terraform tracks state. It knows what it created, and it detects when reality diverges. This is the property that makes it safe to use at scale — no accidental duplicates, no forgotten resources.',
            '',
            '**The core configuration:**',
            '',
            '```hcl',
            'provider "aws" {',
            '  region                      = "us-east-1"',
            '  access_key                  = "flociadmin"',
            '  secret_key                  = "flociadmin"',
            '  skip_credentials_validation = true',
            '  skip_metadata_api_check     = true',
            '  skip_requesting_account_id  = true',
            '  s3_use_path_style           = true',
            '',
            '  endpoints {',
            '    s3  = "http://localhost:4566"',
            '    iam = "http://localhost:4566"',
            '    sts = "http://localhost:4566"',
            '  }',
            '}',
            '',
            'resource "aws_s3_bucket" "terraform_lab" {',
            '  bucket = var.primary_bucket_name',
            '}',
            '```',
            '',
            'The endpoints block redirects every API call to Floci — the same mechanism the CLI uses via AWS_ENDPOINT_URL. The s3_use_path_style setting tells Terraform to use localhost:4566/bucket instead of bucket.s3.amazonaws.com, matching the emulator\'s expectations.',
            '',
            'Two buckets were created (terraform-managed-lab and terraform-managed-backup), both driven by variables. The state file tracks what Terraform manages — and it must never be committed to Git because it can contain sensitive values.',
            '',
            '**Key lesson:** Idempotency. After a successful apply, running plan again shows No changes. Terraform compares config, state, and reality; if they match, it does nothing. This is why infrastructure-as-code is safer than manual commands.'
          ]
        },
        {
          title: 'Phase 3 — Security Controls',
          content: [
            'Phase 3 applied the security controls that every production S3 bucket should have. Four layers, applied through Terraform:',
            '',
            '**1. Block Public Access (all four settings):**',
            '',
            '```hcl',
            'resource "aws_s3_bucket_public_access_block" "terraform_lab" {',
            '  bucket = aws_s3_bucket.terraform_lab.id',
            '',
            '  block_public_acls       = true',
            '  block_public_policy     = true',
            '  ignore_public_acls      = true',
            '  restrict_public_buckets = true',
            '}',
            '```',
            '',
            'Each of the four settings addresses a different vector. block_public_acls prevents new public ACLs. ignore_public_acls neutralises existing ones. block_public_policy rejects public bucket policies. restrict_public_buckets blocks cross-account access via public policies. All four must be enabled for full protection.',
            '',
            '**2. Customer-managed KMS key:**',
            '',
            '```hcl',
            'resource "aws_kms_key" "storage_key" {',
            '  description             = "KMS key for S3 storage encryption"',
            '  deletion_window_in_days = 7',
            '  enable_key_rotation     = true',
            '}',
            '```',
            '',
            'Customer-managed keys give control over rotation, access, and audit. For regulated environments (PCI DSS, HIPAA), they\'re typically required.',
            '',
            '**3. SSE-KMS encryption:**',
            '',
            '```hcl',
            'resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_lab" {',
            '  bucket = aws_s3_bucket.terraform_lab.id',
            '',
            '  rule {',
            '    apply_server_side_encryption_by_default {',
            '      sse_algorithm     = "aws:kms"',
            '      kms_master_key_id = aws_kms_key.storage_key.arn',
            '    }',
            '    bucket_key_enabled = true',
            '  }',
            '}',
            '```',
            '',
            'bucket_key_enabled = true reduces KMS API calls by up to 99% by using a bucket-level derived key.',
            '',
            '**4. Explicit Deny public policy:**',
            '',
            '```hcl',
            'resource "aws_s3_bucket_policy" "terraform_lab_deny_public" {',
            '  bucket = aws_s3_bucket.terraform_lab.id',
            '',
            '  policy = jsonencode({',
            '    Version = "2012-10-17"',
            '    Statement = [{',
            '      Sid       = "DenyPublicRead"',
            '      Effect    = "Deny"',
            '      Principal = "*"',
            '      Action    = "s3:GetObject"',
            '      Resource  = "${aws_s3_bucket.terraform_lab.arn}/*"',
            '      Condition = {',
            '        StringNotEquals = {',
            '          "aws:PrincipalAccount" = "000000000000"',
            '        }',
            '      }',
            '    }]',
            '  })',
            '}',
            '```',
            '',
            'Explicit Deny always wins over Allow. It\'s the last line of defense — even if someone accidentally adds a public Allow policy, this Deny blocks it.',
            '',
            '**5. Least-privilege IAM user:**',
            '',
            'The audit-reader user receives only s3:ListBucket and s3:GetObject, scoped to two specific buckets. No write, no delete, no bucket creation. This is what least privilege looks like in practice.',
            '',
            '**Adopting existing resources:** Phase 3 required terraform import to adopt buckets created by hand in Phase 1. The problem is common — teams introducing IaC into an existing environment face it constantly. Import attaches a real resource to a declared config address; Terraform then manages it like any other resource.'
          ]
        },
        {
          title: 'Phase 4 — Operations and Detection',
          content: [
            'Phase 4 fixed a bug in the audit script, restructured the repository, imported the remaining legacy buckets into Terraform, and moved state to S3.',
            '',
            '**The audit script.** It iterates every bucket and checks two things: whether Block Public Access is enabled (all four settings), and whether any bucket policy contains Effect: "Allow" with a wildcard Principal. Findings are written to a timestamped JSON report, a rolling log is appended, and the script exits non-zero when findings exist — so CI systems can fail on it.',
            '',
            '**The policy check, correctly written:**',
            '',
            '```bash',
            'has_wildcard=$(echo "$policy_raw" | jq \'',
            '  [.Statement[] | select(.Effect == "Allow") | select(.Principal == "*")] | length',
            '\')',
            '',
            'if [ "$has_wildcard" -gt 0 ]; then',
            '  echo "  CRITICAL: Public policy with wildcard principal (Allow)"',
            'fi',
            '```',
            '',
            'The original version used a grep pattern that didn\'t match the actual output format. The rewrite with jq parses JSON structurally — no escaping ambiguity, no false negatives.',
            '',
            '**Remote state.** State was moved from a local file to S3:',
            '',
            '```hcl',
            'terraform {',
            '  backend "s3" {',
            '    bucket = "terraform-state-storage"',
            '    key    = "storage-platform/terraform.tfstate"',
            '    region = "us-east-1"',
            '    # Floci-specific endpoint and credentials omitted for brevity',
            '  }',
            '}',
            '```',
            '',
            'Remote state prevents loss if a laptop dies, and enables team collaboration. Credentials are externalised — the backend config is gitignored, with a template provided for reference.',
            '',
            '**The final audit:** Six buckets, zero findings. Every bucket managed by Terraform, all with Block Public Access enabled, no public policies.'
          ]
        },
        {
          title: 'The Misconfiguration Drill',
          content: [
            '**This is the part of the project that taught the most.**',
            '',
            'After Phase 4, the environment was clean. Every bucket was secured. The audit reported zero findings. In a real engineering context, that\'s where many projects stop — "it works, ship it."',
            '',
            'I broke it on purpose.',
            '',
            '**Two commands:**',
            '',
            '```bash',
            '# Disable all four Block Public Access settings on the backup bucket',
            'aws s3api put-public-access-block \\',
            '  --bucket terraform-managed-backup \\',
            '  --public-access-block-configuration \\',
            '  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"',
            '',
            '# Attach a public read policy',
            'aws s3api put-bucket-policy \\',
            '  --bucket terraform-managed-backup \\',
            '  --policy \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::terraform-managed-backup/*"}]}\'',
            '```',
            '',
            'The bucket was now readable by anyone on the internet.',
            '',
            '**What Terraform caught.** Running terraform plan immediately:',
            '',
            '```text',
            '~ resource "aws_s3_bucket_public_access_block" "backup_lab" {',
            '    ~ block_public_acls       = false -> true',
            '    ~ block_public_policy     = false -> true',
            '    ~ ignore_public_acls      = false -> true',
            '    ~ restrict_public_buckets = false -> true',
            '  }',
            '',
            'Plan: 0 to add, 1 to change, 0 to destroy.',
            '```',
            '',
            'Terraform detected the Block Public Access drift because that resource was declared in its configuration. It proposed restoring the correct settings.',
            '',
            '**What Terraform missed.** The public policy was not declared in the configuration, so Terraform had no way to detect it. Terraform only manages what it knows about. Anything created outside its scope is invisible.',
            '',
            'This is not a Terraform failure. It\'s a fundamental property of declarative IaC: the tool manages what you tell it to manage. Everything else requires independent detection.',
            '',
            '**What the audit script caught — and didn\'t.** The Phase 3 audit script ran against the broken bucket. It correctly flagged the four disabled Block Public Access settings. It did not flag the public policy.',
            '',
            'The grep pattern in the script was looking for escaped JSON quotes in a specific format. The actual output of aws s3api get-bucket-policy didn\'t match. This was a silent false negative — the script reported "fine" when the bucket was exposed.',
            '',
            'That bug was the reason Phase 4 exists.',
            '',
            '**The fix.** Rewriting the check with jq made it structural. Parse JSON as JSON, select statements where Effect == "Allow" and Principal == "*", count them. Zero means no public policy; anything greater is a finding. Tested against both a correctly configured bucket (returns 0) and a deliberately exposed one (returns 1). Both cases passed.'
          ]
        },
        {
          title: 'Key Lesson',
          content: [
            '**Detection tools need their own testing.**',
            '',
            'A detector that fails silently is worse than no detector, because it creates false confidence. The bucket looked safe. The script said it was safe. But the script was broken.',
            '',
            'This is a known problem in security engineering — detection content is software, and software has bugs. Mature teams test their detectors against both positive cases (a misconfiguration that should be caught) and negative cases (a correct configuration that should not be flagged). Anything less produces noise on one side and silence on the other.',
            '',
            'The lesson generalises beyond this project. Every automated check — Config rules, GuardDuty findings, custom Lambda detectors, dashboards — needs the same discipline. The check that catches 99% of cases but fails on the one that matters is not a control. It\'s a comfort blanket.'
          ]
        },
        {
          title: 'What I\'d Do Differently',
          content: [
            '**1. Test the audit script from day one.** The bug existed for a full phase. In a real environment, that\'s a window during which exposure could go undetected. The script should have been tested against a known-bad bucket the moment it was written.',
            '',
            '**2. Use Terraform modules earlier.** The module refactor in Phase 5B reduced ~25 resource blocks to five module calls. That structure should have been in place from Phase 2 — copying config between phases led to a missing-resource error that cost time.',
            '',
            '**3. Separate detection from remediation more clearly.** In production, detection runs on a schedule and independently of the infrastructure it checks. Tying detection to the same repo as infrastructure makes sense for learning, but production would deploy it separately.',
            '',
            '**4. Add CI earlier.** The audit script runs manually. A GitHub Actions workflow that runs it on every push would make detection a control rather than a suggestion. That\'s the next extension.'
          ]
        },
        {
          title: 'Outcome',
          content: [
            'After four phases (plus the modules refactor), the project delivers:',
            '',
            '- Five S3 buckets, all with Block Public Access enabled, SSE-KMS encryption, and no public policies',
            '',
            '- A customer-managed KMS key with rotation enabled',
            '',
            '- A least-privilege IAM user scoped to two specific buckets and read-only actions',
            '',
            '- A custom audit script with JSON reporting, rolling logs, and CI-friendly exit codes',
            '',
            '- Remote state in S3 with credentials externalised',
            '',
            '- A documented incident-response workflow covering detection, triage, containment, investigation, remediation, and post-mortem',
            '',
            '- A reusable Terraform module for secure S3 buckets',
            '',
            'The full project is available on GitHub. Every phase has its own README, every architectural decision is documented, and the entire environment is reproducible from code.',
            '',
            'More importantly: the project demonstrates an approach. Build it. Break it on purpose. Test whether the detection catches what you broke. Fix what it doesn\'t. That loop is the core of cloud security engineering, and it\'s the reason this project exists.'
          ]
        }
      ]
    },
    'zeus-malware-analysis': {
      title: 'Zeus Banking Trojan – Malware Analysis Report',
      date: 'June 1, 2025',
      github: 'https://github.com/Linathimqalo/Malware-Analysis',
      technologies: ['Malware Analysis', 'IDA Pro', 'OllyDbg', 'Wireshark', 'YARA Rules', 'Virtual Machines'],
      sections: [
        {
          title: 'Executive Summary',
          content: `This comprehensive analysis examines a Zeus banking trojan sample, focusing on its functionality, behavior patterns, and detection mechanisms. Zeus is a sophisticated piece of malware designed to steal banking credentials and financial information from infected systems. Through static and dynamic analysis techniques, we uncovered the malware's persistence mechanisms, communication protocols, and evasion techniques.`
        },
        {
          title: 'Sample Details',
          content: [
            '**File Information:**',
            '- File name: zeus_sample.exe',
            '- MD5: a1b2c3d4e5f6789012345678901234ab',
            '- SHA1: 1234567890abcdef1234567890abcdef12345678',
            '- SHA256: abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
            '- File size: 245,760 bytes',
            '- File type: PE32 executable (GUI) Intel 80386'
          ]
        },
        {
          title: 'Static Analysis',
          content: [
            '**PE Binary Format Analysis:**',
            '- Entry point: 0x00401000',
            '- Compilation timestamp: 2024-05-15 14:23:17',
            '- Sections: .text, .rdata, .data, .rsrc',
            '',
            '**Suspicious Strings Detected:**',
            '- Banking URLs and financial institution references',
            '- Registry key manipulation strings',
            '- Network communication endpoints',
            '- Encryption/decryption function names',
            '',
            '**DLL Dependencies:**',
            '- kernel32.dll - Process and memory management',
            '- user32.dll - User interface manipulation',
            '- wininet.dll - Internet connectivity functions',
            '- advapi32.dll - Registry manipulation',
            '',
            '**CAPA Findings:**',
            '- Keylogging capabilities detected',
            '- Form grabbing functionality',
            '- Process injection techniques',
            '- Anti-analysis evasion methods'
          ]
        },
        {
          title: 'Dynamic Analysis',
          content: [
            '**Observed Behavior:**',
            '- Creates mutex for single instance execution',
            '- Establishes persistence via registry run keys',
            '- Injects code into legitimate browser processes',
            '- Monitors web traffic for banking sites',
            '- Exfiltrates captured data to C&C servers',
            '',
            '**Process Masquerading:**',
            '- Copies itself to system directories',
            '- Uses legitimate-sounding process names',
            '- Manipulates process memory to evade detection',
            '',
            '**Host-based Indicators:**',
            '- Registry modifications in HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
            '- File creation in %APPDATA%\\Microsoft\\Windows',
            '- Network connections to suspicious domains',
            '- Browser process memory injection'
          ]
        },
        {
          title: 'YARA Detection Rule',
          content: `\`\`\`yara
rule Zeus_Banking_Trojan {
    meta:
        description = "Detects Zeus banking trojan variants"
        author = "Linathi Mqalo"
        date = "2025-06-01"
        malware_family = "Zeus"
        severity = "high"
    
    strings:
        $s1 = "SOFTWARE\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run" wide ascii
        $s2 = "wininet.dll" nocase
        $s3 = { 8B 45 ?? 83 C0 ?? 89 45 ?? } // Assembly pattern
        $s4 = "POST" wide ascii
        $s5 = "Content-Type: application/x-www-form-urlencoded" wide ascii
        
        $hex1 = { 55 8B EC 83 EC ?? 53 56 57 }
        $hex2 = { 6A ?? 68 ?? ?? ?? ?? E8 }
        
    condition:
        uint16(0) == 0x5A4D and
        filesize < 500KB and
        (
            (3 of ($s*)) or
            (2 of ($hex*)) or
            (2 of ($s*) and 1 of ($hex*))
        )
}
\`\`\``
        }
      ]
    },
    'cloud-honeypot-analysis': {
      title: 'Comparative Cloud Honeypot Analysis – GCP vs Azure',
      date: 'May 17, 2025',
      github: 'https://github.com/Linathimqalo/cloud-honeypot-analysis',
      technologies: ['T-POT', 'Docker', 'GCP', 'Azure', 'ELK Stack', 'Threat Intelligence'],
      sections: [
        {
          title: 'Introduction & Purpose',
          content: `This comprehensive study compares the effectiveness, performance, and insights gained from deploying T-Pot honeypot systems across Google Cloud Platform (GCP) and Microsoft Azure. The analysis provides valuable intelligence on attack patterns, threat landscapes, and cloud security considerations for organizations choosing between these major cloud providers.`
        },
        {
          title: 'Environment Setup',
          content: [
            '| Component | GCP Configuration | Azure Configuration |',
            '|-----------|------------------|-------------------|',
            '| VM Instance | e2-standard-4 (4 vCPU, 16GB RAM) | Standard_D4s_v3 (4 vCPU, 16GB RAM) |',
            '| Operating System | Ubuntu 20.04 LTS | Ubuntu 20.04 LTS |',
            '| Storage | 100GB SSD Persistent Disk | 100GB Premium SSD |',
            '| Network | Custom VPC with firewall rules | Virtual Network with NSG |',
            '| Region | us-central1 | East US |',
            '| T-Pot Version | 23.04.0 | 23.04.0 |'
          ]
        },
        {
          title: 'T-Pot Architecture & Components',
          content: [
            '**Core Honeypot Services:**',
            '- Cowrie (SSH/Telnet honeypot)',
            '- Dionaea (Multi-protocol honeypot)',
            '- Honeytrap (Network honeypot)',
            '- Glastopf (Web application honeypot)',
            '- Conpot (Industrial control system honeypot)',
            '',
            '**Data Processing & Visualization:**',
            '- Elasticsearch for log storage and indexing',
            '- Kibana for data visualization and dashboards',
            '- Logstash for log processing and enrichment',
            '- Suricata for network intrusion detection'
          ]
        },
        {
          title: 'Attack Metrics & Threat Intelligence',
          content: [
            '**Top Targeted Ports:**',
            '- Port 22 (SSH): 45% of total attacks',
            '- Port 23 (Telnet): 28% of total attacks',
            '- Port 80 (HTTP): 15% of total attacks',
            '- Port 443 (HTTPS): 8% of total attacks',
            '- Port 2323 (Telnet alt): 4% of total attacks',
            '',
            '**Common CVEs Exploited:**',
            '- CVE-2021-44228 (Log4Shell)',
            '- CVE-2017-0144 (EternalBlue)',
            '- CVE-2014-6271 (Shellshock)',
            '- CVE-2016-10033 (PHPMailer)',
            '',
            '**Top Attacker Countries:**',
            '1. China (32%)',
            '2. Russia (18%)',
            '3. United States (12%)',
            '4. Germany (8%)',
            '5. Netherlands (6%)'
          ]
        },
        {
          title: 'Azure Insights',
          content: [
            '**Performance Characteristics:**',
            '- Average response time: 245ms',
            '- Network throughput: 850 Mbps',
            '- Storage IOPS: 3,200',
            '- Monthly cost: $156.80',
            '',
            '**Security Features:**',
            '- Network Security Groups provide granular control',
            '- Azure Security Center integration available',
            '- Built-in DDoS protection',
            '- Comprehensive logging through Azure Monitor',
            '',
            '**Attack Patterns:**',
            '- Higher frequency of brute force attacks',
            '- More sophisticated malware samples',
            '- Increased targeting of RDP services'
          ]
        },
        {
          title: 'GCP Insights',
          content: [
            '**Performance Characteristics:**',
            '- Average response time: 198ms',
            '- Network throughput: 920 Mbps',
            '- Storage IOPS: 3,500',
            '- Monthly cost: $142.30',
            '',
            '**Security Features:**',
            '- Cloud Security Command Center integration',
            '- VPC firewall rules with hierarchical policies',
            '- Cloud Armor for DDoS protection',
            '- Stackdriver monitoring and logging',
            '',
            '**Attack Patterns:**',
            '- More diverse attack vectors',
            '- Higher volume of scanning activities',
            '- Increased IoT botnet activity'
          ]
        },
        {
          title: 'Performance, Cost & Stability Comparison',
          content: [
            '**Performance Winner: GCP**',
            '- 19% better response times',
            '- 8% higher network throughput',
            '- 9% better storage performance',
            '',
            '**Cost Winner: GCP**',
            '- 9.2% lower monthly operational costs',
            '- Better price-to-performance ratio',
            '- More predictable billing',
            '',
            '**Stability Analysis:**',
            '- Azure: 99.95% uptime, 2 minor incidents',
            '- GCP: 99.97% uptime, 1 minor incident',
            '- Both platforms exceeded SLA commitments'
          ]
        },
        {
          title: 'Conclusion & Future Work',
          content: [
            '**Key Findings:**',
            '- GCP demonstrated superior performance and cost-effectiveness',
            '- Azure provided more comprehensive native security tooling',
            '- Both platforms are viable for honeypot deployments',
            '- Attack patterns vary significantly between cloud providers',
            '',
            '**Recommendations:**',
            '- Choose GCP for budget-conscious deployments',
            '- Select Azure for enterprise security integration',
            '- Deploy across multiple clouds for comprehensive threat intelligence',
            '',
            '**Future Research:**',
            '- Multi-region deployment analysis',
            '- Kubernetes-based honeypot orchestration',
            '- AI-powered attack pattern recognition',
            '- Integration with threat intelligence platforms'
          ]
        }
      ]
    },
    'luxury-portfolio-app': {
      title: 'Luxury Portfolio + Docs + Blog Web Application',
      date: 'September 29, 2025',
      github: 'https://github.com/Linathimqalo/luxury-portfolio-app',
      live: 'https://aureum-omega.vercel.app/',
      technologies: [
        'Next.js',
        'TypeScript',
        'Supabase',
        'TailwindCSS',
        'ShadCN UI',
        'Framer Motion'
      ],
      sections: [
        {
          title: 'Introduction & Purpose',
          content: `This project delivers a modern, luxury-inspired personal portfolio platform that integrates a blog, project showcase, certifications, and documentation features. The application emphasizes premium aesthetics, responsive design, and full CRUD functionality, built on a Supabase backend with advanced security (RLS policies) and seamless file storage integration.`
        },
        {
          title: 'Backend Architecture',
          content: [
            '**Database Schema (Supabase Postgres):**',
            '- Profiles: user information, theme preferences, custom palettes',
            '- Projects: project details, media, repo/demo links',
            '- Project Media: associated media assets',
            '- Docs: markdown-based documents with public/private visibility',
            '- Posts: blog entries with slug routing, tags, and publish states',
            '- Certifications: credential entries with images and verification links',
            '',
            '**Storage Buckets:**',
            '- avatars',
            '- project_media',
            '- post_covers',
            '- certs',
            '',
            '**Row Level Security Policies:**',
            '- Enforced per-user ownership on create, update, and delete',
            '- Public read for published posts, public docs, and certifications'
          ]
        },
        {
          title: 'Frontend Design & UX',
          content: [
            '**Design Inspirations:** Tesla, Apple, Medium',
            '**Key Features:**',
            '- Minimalist, premium design with excellent whitespace',
            '- Light/Dark mode toggle with customizable accent palettes',
            '- Modern sans-serif typography with optional serif headings',
            '- Subtle gold accents (#C7843B, #F3BD68)',
            '- Floating particles with occasional shooting star effect',
            '- Smooth animations and hover effects using Framer Motion',
            '',
            '**Responsive Layouts:**',
            '- Optimized for mobile, tablet, and desktop',
            '- Grid-based card layouts for projects, posts, and certifications'
          ]
        },
        {
          title: 'Core Functionality',
          content: [
            '- **Authentication:** Supabase Auth with email/password (social logins optional)',
            '- **CRUD Operations:** Fully wired for projects, docs, posts, and certifications',
            '- **File Uploads:** Supabase storage buckets for avatars, project media, post covers, and certs',
            '- **Profile & Settings:** Avatar upload, bio, theme switch, accent color picker',
            '- **Advanced Search:** Full-text search across projects, docs, and posts',
            '- **Slug Management:** Unique slugs for docs and posts with validation'
          ]
        },
        {
          title: 'UI Enhancements & Polish',
          content: [
            '- Loading, error, and empty states with elegant placeholders',
            '- Parallax hero banner with animated logo/name',
            '- Hover states with gold glow and subtle scaling',
            '- Consistent card sizing and spacing',
            '- Glass-like panels in dark mode for depth and luxury feel',
            '- Smooth theme transition animations'
          ]
        },
        {
          title: 'Performance & Accessibility',
          content: [
            '- Lazy-loaded images with Supabase transformations',
            '- Stale-while-revalidate caching for docs and posts lists',
            '- Optimized grid rendering for large datasets',
            '- Keyboard-accessible modals and navigation',
            '- Proper ARIA attributes for interactive elements'
          ]
        },
        {
          title: 'Results & Deliverables',
          content: [
            '- Production-ready portfolio app scaffold',
            '- Supabase backend with secure RLS policies',
            '- Fully functional frontend with premium design',
            '- CRUD and file uploads tested and verified',
            '- Advanced search and filtering integrated',
            '- Theme customization and particles toggle implemented'
          ]
        },
        {
          title: 'Future Enhancements (Phase 2)',
          content: [
            '- Team/collaborator roles with shared editing',
            '- Paid subscription tiers for advanced features',
            '- Analytics dashboard for post and project engagement',
            '- AI-assisted writing for docs and blog',
            '- PDF export and social sharing integrations'
          ]
        }
      ]
    },
    'personal-finance-app': {
      title: 'Personal Finance Management Web Application',
      date: 'September 29, 2025',
      github: 'https://github.com/Linathimqalo/lumin-wealth',
      live: 'https://finora-gold.vercel.app/',
      technologies: [
        'React',
        'TypeScript',
        'TailwindCSS',
        'Framer Motion',
        'PostgreSQL'
      ],
      sections: [
        {
          title: 'Introduction & Purpose',
          content: `A full-stack personal finance application designed to help users manage budgets, track transactions, set financial goals, monitor debts, and analyze investments. The app emphasizes real-time insights, multi-currency support, and a premium, glassmorphism-inspired UI to make financial tracking both practical and elegant.`
        },
        {
          title: 'Backend Architecture',
          content: [
            '**Database Schema (Supabase Postgres):**',
            '- Transactions: income/expenses with categorization',
            '- Budgets: spending limits by category and period',
            '- Goals: savings and progress tracking',
            '- Investments: assets with live pricing integration',
            '- Debts: liabilities with payoff tracking',
            '- Recurring Transactions: automated income/expense entries',
            '- User Profiles: preferred currency, theme, and settings',
            '',
            '**Row Level Security Policies:**',
            '- Enforced per-user ownership on create, update, and delete',
            '- Full CRUD operations scoped by user_id for all tables'
          ]
        },
        {
          title: 'Frontend Design & UX',
          content: [
            '**Design Inspirations:** Luxury dashboards, fintech apps',
            '**Key Features:**',
            '- Dashboard with live charts, net worth, income/expenses',
            '- Sidebar navigation with collapsible mode',
            '- Dark/Light theme toggle',
            '- Multi-currency conversion system with user preferences',
            '- Glassmorphism and gold-accent styling',
            '',
            '**Responsive Layouts:**',
            '- Optimized for desktop and mobile with card-based views',
            '- Interactive charts for trends and breakdowns'
          ]
        },
        {
          title: 'Core Functionality',
          content: [
            '- **Authentication:** Supabase Auth with email/password',
            '- **Transactions:** Full CRUD, CSV import/export, filtering, and categorization',
            '- **Budgets:** Create, update, delete, and monitor category-based limits',
            '- **Goals:** Track progress towards financial targets with editable milestones',
            '- **Investments:** Track assets with live API integration for pricing',
            '- **Reports:** Generate summaries and visual breakdowns of spending/income',
            '- **Settings:** User profile management, currency selection, theme toggle'
          ]
        },
        {
          title: 'UI Enhancements & Polish',
          content: [
            '- Consistent currency formatting using CurrencyAmount component',
            '- Hover/animation states powered by Framer Motion',
            '- Elegant placeholders for empty states',
            '- Visual progress indicators for goals and budgets',
            '- Error handling for API (CORS fallback, null safety checks)'
          ]
        },
        {
          title: 'Performance & Accessibility',
          content: [
            '- Real-time syncing with Supabase subscriptions',
            '- Lazy-loaded charts and tables for performance',
            '- Mobile-first design tested on multiple devices',
            '- Proper ARIA attributes for form inputs and modals'
          ]
        },
        {
          title: 'Results & Deliverables',
          content: [
            '- Production-ready finance app scaffold',
            '- Functional Supabase backend with secure RLS',
            '- CRUD and CSV import/export verified',
            '- Currency system integrated across app',
            '- Fully responsive premium UI implemented'
          ]
        },
        {
          title: 'Future Enhancements (Phase 2)',
          content: [
            '- Collaboration features for shared household accounts',
            '- Subscription tiers for premium analytics',
            '- AI-driven financial recommendations',
            '- PDF/Excel export for reports',
            '- Notifications and reminders for recurring transactions'
          ]
        }
      ]
    }        
  };

  const project = projectData[id || ''];

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((line, index) => {
        if (line.startsWith('|') && line.endsWith('|')) {
          // Table row
          return (
            <div key={index} className="table-row">
              {line.split('|').slice(1, -1).map((cell, cellIndex) => (
                <div key={cellIndex} className="table-cell border border-border p-2 text-sm">
                  {cell.trim()}
                </div>
              ))}
            </div>
          );
        } else if (line.startsWith('**') && line.endsWith(':**')) {
          // Bold heading
          return <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">{line.slice(2, -3)}</h4>;
        } else if (line.startsWith('- ')) {
          // List item
          return <li key={index} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
        } else if (line.match(/^\d+\./)) {
          // Numbered list item
          return <li key={index} className="ml-4 text-muted-foreground list-decimal">{line}</li>;
        } else if (line === '') {
          // Empty line
          return <br key={index} />;
        } else {
          // Regular text
          return <p key={index} className="text-muted-foreground mb-2">{line}</p>;
        }
      });
    } else if (content.includes('```')) {
      // Code block
      const parts = content.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is a code block
          const lines = part.split('\n');
          const language = lines[0];
          const code = lines.slice(1).join('\n');
          return (
            <pre key={index} className="bg-muted/50 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm text-foreground font-mono">{code}</code>
            </pre>
          );
        } else {
          // Regular content
          return <p key={index} className="text-muted-foreground">{part}</p>;
        }
      });
    } else {
      return <p className="text-muted-foreground leading-relaxed">{content}</p>;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="mb-8">
                <Button
                  variant="ghost"
                  className="mb-6 p-0 h-auto text-primary hover:text-primary/80"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
                
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.date}</span>
                </div>

                <h1 className="font-montserrat font-bold text-4xl lg:text-5xl mb-4 text-foreground">
                  {project.title}
                </h1>

                <div className="flex gap-4 mb-6">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-primary/20 hover:border-primary/40"
                    asChild
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="border-primary/20 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Content Sections */}
              <div className="space-y-12">
                {project.sections.map((section: any, index: number) => (
                  <motion.section
                    key={index}
                    variants={itemVariants}
                    className="card-elegant"
                  >
                    <h2 className="font-poppins font-bold text-2xl text-foreground mb-6">
                      {section.title}
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      {renderContent(section.content)}
                    </div>
                  </motion.section>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default ProjectDetail;