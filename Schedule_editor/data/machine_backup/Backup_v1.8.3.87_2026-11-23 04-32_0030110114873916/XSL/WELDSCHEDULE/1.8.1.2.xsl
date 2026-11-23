<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/sched/overrides/blast_time_override_max" />
	<xsl:template match="/sched/overrides/blast_time_override_rate" />

	<xsl:template match="/sched/segment/blast_time" />
	<xsl:template match="/sched/segment/dip_detect_clear_short_offset_from_blast_current" />
	<xsl:template match="/sched/segment/dip_start_ramp_to_clear_short_offset_from_blast_current" />
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>