import { motion } from 'framer-motion';

const GitHubActivity = () => {
    return (
        <motion.div
            className="glass p-8 rounded-xl border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ boxShadow: 'var(--shadow-md)' }}
        >
            <h3 className="text-xl font-semibold text-foreground mb-4">
                GitHub Activity
            </h3>
            <div className="overflow-x-auto">
                <img
                    src="https://ghchart.rshah.org/guy-with-a-cool-terminal"
                    alt="GitHub Contribution Graph"
                    className="w-full min-w-[600px]"
                    loading="lazy"
                />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
                Consistent contributions throughout the year
            </p>
        </motion.div>
    );
};

export default GitHubActivity;
