<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="sched/global">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<pipe_diameter_edit_mode>0</pipe_diameter_edit_mode>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="sched/segment">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<dip_blast_current_ramp_rate>300</dip_blast_current_ramp_rate>
			<dip_burnback_current_ramp_rate>300</dip_burnback_current_ramp_rate>
			<dip_detect_clear_short_offset_from_blast_current>-600</dip_detect_clear_short_offset_from_blast_current>
			<dip_start_ramp_to_clear_short_offset_from_blast_current>-600</dip_start_ramp_to_clear_short_offset_from_blast_current>
			<pipe_diameter>
				<xsl:value-of select="/sched/description/outer_diameter"/>
			</pipe_diameter>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>