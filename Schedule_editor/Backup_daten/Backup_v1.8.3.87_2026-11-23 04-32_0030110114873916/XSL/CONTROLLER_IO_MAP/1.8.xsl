<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <!-- Condition <module='JASPER'> was added as we have 2 systems(GT7 LSC).
       Both systems should match schema as well as correctly run  -->
  <xsl:template match="iomap/system/io[@module='JASPER']/p250_fault" /> 
  <xsl:template match="iomap/system/io[@module='JASPER']/over_temperature" /> 
  <xsl:template match="/iomap/system/io[@module='JASPER']/cs300_temperature_fault" />
  <xsl:template match="/iomap/system/io[@module='JASPER']/firmware_version" />

  <xsl:template match="iomap/system/io[@module='JASPER']/*[last()]">
     <xsl:choose>
      <xsl:when test="/iomap/system/io[@module='JASPER']/firmware_version">
        <xsl:copy-of select="/iomap/system/io[@module='JASPER']/firmware_version"/>
      </xsl:when>
      <xsl:otherwise>
         <xsl:if test="not(/iomap/system/io[@module='JASPER']/over_temperature)">
           <xsl:copy-of select="."/>
         </xsl:if>
         <firmware_version offset="51"/>
      </xsl:otherwise>
     </xsl:choose>

    <xsl:choose>
     <xsl:when test="/iomap/system/io[@module='JASPER']/cs300_temperature_fault">
        <xsl:copy-of select="/iomap/system/io[@module='JASPER']/cs300_temperature_fault"/>
     </xsl:when>
      <xsl:otherwise>
        <cs300_temperature_fault offset="39" bit="10" checkType='0'/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="iomap/power/io[@module='JASPER']/voltage_deadband" />
  <xsl:template match="iomap/power/io[@module='JASPER']/mig_dynamic_mode" />
  <xsl:template match="iomap/power/io[@module='JASPER']/detect_short_voltage" />
  <xsl:template match="iomap/power/io[@module='JASPER']/clear_short_voltage" />
  <xsl:template match="iomap/power/io[@module='JASPER']/clear_short_ramp_rate" />
  <xsl:template match="iomap/power/io[@module='JASPER']/*[last()]">
    <xsl:if test="name(.) != 'clear_short_ramp_rate'">
          <xsl:copy-of select="."/>
    </xsl:if>
    <voltage_deadband offset="84" mask="0xD000" analog_high="50" analog_low="0" digital_high="2047" digital_low="0"/>
    <mig_dynamic_mode offset="97" bit="0"/>
    <detect_short_voltage offset="84" mask="0xE000" analog_high="50" analog_low="0" digital_high="4095" digital_low="0"/>
    <clear_short_voltage offset="84" mask="0xF000" analog_high="50" analog_low="0" digital_high="4095" digital_low="0"/>
    <clear_short_ramp_rate offset="84" mask="0xA000" digital_high="4095" digital_low="0"/>
    <mig_pulse_exponential_decay_period offset="85" digital_high="4095" digital_low="0"/>
    <dynamics_threshold_voltage offset="108" mask="0x0000" analog_high="50" analog_low="0" digital_high="4095" digital_low="0"/>
  </xsl:template>

  <xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="43" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="44" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="45" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="46" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="47" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="48" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="49" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/capacitor_select"/> 
  <xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="name(.) != 'capacitor_select'">
     <capacitor_select offset="50" bit="3" mask="0x3000"/>
    </xsl:if>
  </xsl:template> 

  <xsl:template match="iomap/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:if test="not(/iomap/high_speed_data)">
	<high_speed_data>
		<io module="JASPER">
		<control offset="96"/>
		<is_busy offset="96" bit="0" />
		<is_last_page offset="96" bit="1" />
		<is_full offset="96" bit="2" />
		<bytes_1_0 offset="60"/>
		<bytes_3_2 offset="59"/>
		<bytes_5_4 offset="58"/>
		<bytes_7_6 offset="57"/>
		<bytes_9_8 offset="56"/>
		<bytes_11_10 offset="55"/>
		<bytes_13_12 offset="54"/>
		<bytes_15_14 offset="53"/>
		</io>
	</high_speed_data>
    </xsl:if>
    <xsl:if test="not(/iomap/firmware_test)">
	<firmware_test>
		<io module="JASPER">
			<register_0 offset="1000" />
			<register_1 offset="1001" />
			<register_2 offset="1002" />
			<register_3 offset="1003" />
			<register_4 offset="1004" />
			<register_5 offset="1005" />
			<register_6 offset="1006" />
			<register_7 offset="1007" />
			<register_8 offset="1008" />
			<register_9 offset="1009" />
		</io>
	</firmware_test>
    </xsl:if>
  </xsl:template>

  <!-- Do not change the template below -->
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template> 

</xsl:stylesheet>