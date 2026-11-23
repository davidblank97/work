<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<xsl:template match="/sched/segment/mig_pulse_start_delay" />
	<xsl:template match="/sched/segment/mig_pulse_stop_delay" />
	<xsl:template match="/sched/segment/mig_pulse_exponential_smoothing" />
	<xsl:template match="/sched/segment/mig_pulse_p_gain" />
	<xsl:template match="/sched/segment/mig_pulse_i_gain" />
	<xsl:template match="/sched/segment/mig_pulse_d_gain" />

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>