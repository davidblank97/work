<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" indent="no"/>
	<xsl:preserve-space elements="*"/>

	<xsl:template match="/iomap/system/io[@module='JASPER']/camera_sync_trigger_multiplier">
		<xsl:copy-of select="."/>
		<beeper_external offset="38" bit="7" />
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>